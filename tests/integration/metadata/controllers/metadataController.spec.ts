import { exec } from 'child_process';
import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';
import { Application } from 'express';
import { QueryFailedError, Repository } from 'typeorm';
import config from 'config';
import { Connection } from 'typeorm';
import jsLogger from '@map-colonies/js-logger';
import { Metadata } from '../../../../src/metadata/models/metadata.entity';
import { IMetadataEntity } from '../../../../src/metadata/models/metadata';
import { createFakeMetadataEntity, createFakeMetadataRecord, getUpdatePayload } from '../../../helpers/helpers';
import { registerTestValues } from '../../testContainerConfig';
import { BadValues } from '../../../../src/metadata/controllers/errors';
import { DbConfig } from '../../../../src/common/interfaces';
import { initializeConnection } from '../../../../src/common/utils/db';
import { SERVICES } from '../../../../src/common/constants';
import { getRepositoryFromContainer } from './helpers/db';
import * as requestSender from './helpers/requestSender';

describe('MetadataController', function () {
  let app: Application;
  let connection: Connection;

  beforeAll(async function () {
    container.register(SERVICES.CONFIG, { useValue: config });

    container.register(SERVICES.LOGGER, { useValue: jsLogger({ enabled: false }) });

    connection = await initializeConnection(config.get<DbConfig>('test'));
    await connection.synchronize();
    const repository = connection.getRepository(Metadata);
    container.register(Connection, { useValue: connection });
    container.register(SERVICES.METADATA_REPOSITORY, { useValue: repository });

    app = requestSender.getApp();
  });

  afterAll(async function () {
    await connection.close();
    container.reset();
  });

  describe('GET /metadata', function () {
    describe('Happy Path 🙂', function () {
      it('should return 204 if there are no metadata records', async function () {
        const response = await requestSender.getAll(app);

        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });

      it('should return 200 status code and a metadata records list', async function () {
        const metadata = createFakeMetadataRecord();
        // const payload = getPayload(metadata);

        const createResponse = await requestSender.createRecord(app, metadata);
        expect(createResponse.status).toBe(httpStatusCodes.CREATED);
        expect(createResponse.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        const response = await requestSender.getAll(app);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toHaveLength(1);

        const { anytextTsvector, ...createResponseWithoutTsVector } = (createResponse.body as unknown) as IMetadataEntity;

        expect(response.body).toMatchObject([createResponseWithoutTsVector]);
      });
    });

    describe('Bad Path 😡', function () {
      // No bad paths here!
    });

    describe('Sad Path 😥', function () {
      it('should return 500 status code if a db exception happens', async function () {
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ find: findMock });

        const response = await requestSender.getAll(mockedApp);
        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('GET /metadata/{identifier}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 200 status code and the metadata record', async function () {
        const metadata = createFakeMetadataRecord();

        const createResponse = await requestSender.createRecord(app, metadata);
        expect(createResponse.status).toBe(httpStatusCodes.CREATED);
        expect(createResponse.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');

        const id = ((createResponse.body as unknown) as IMetadataEntity).identifier;
        const response = await requestSender.getRecord(app, id);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');

        const { anytextTsvector, ...createResponseWithoutTsVector } = (createResponse.body as unknown) as IMetadataEntity;
        expect(response.body).toMatchObject(createResponseWithoutTsVector);
      });
    });

    describe('Bad Path 😡', function () {
      // No bad paths here!
    });

    describe('Sad Path 😥', function () {
      it('should return 404 if a metadata record with the requested identifier does not exist', async function () {
        const response = await requestSender.getRecord(app, '1');

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message', `Metadata record with given identifier was not found.`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.getRecord(mockedApp, '1');

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('POST /metadata', function () {
    describe('Happy Path 🙂', function () {
      it('if productId not exists, should return 201 status code and the added metadata record when productVersion = 1', async function () {
        const metadata = createFakeMetadataRecord();
        const response = await requestSender.createRecord(app, metadata);
        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');

        const body = (response.body as unknown) as IMetadataEntity;
        const getResponse = await requestSender.getRecord(app, body.identifier);
        const { anytextTsvector, wkbGeometry, ...createdResponseBody } = body;

        expect(getResponse.body).toMatchObject(createdResponseBody);
        expect(createdResponseBody.productVersion).toBe(1);
      });

      it('if productId exists, should return 201 status code and the added metadata record when productVersion is + 1', async function () {
        const metadata = createFakeMetadataRecord();
        const response = await requestSender.createRecord(app, metadata);
        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        const oldBody = (response.body as unknown) as IMetadataEntity;

        metadata.productId = oldBody.productId;
        const newResponse = await requestSender.createRecord(app, metadata);
        expect(newResponse.status).toBe(httpStatusCodes.CREATED);
        expect(newResponse.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        const body = (newResponse.body as unknown) as IMetadataEntity;

        const getResponse = await requestSender.getRecord(app, body.identifier);
        const { anytextTsvector, wkbGeometry, ...createdResponseBody } = body;

        expect(getResponse.body).toMatchObject(createdResponseBody);
        expect(createdResponseBody.productId).toBe(oldBody.productId);
        expect(createdResponseBody.productVersion).toBe(Number(oldBody.productVersion) + 1);
      });
    });

    describe('Bad Path 😡', function () {
      it('should return 400 status code if productId is not exists', async function () {
        const metadata = createFakeMetadataRecord();
        metadata.productId = '2';
        const response = await requestSender.createRecord(app, metadata);
        expect(response).toMatchObject(BadValues);
        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.text).toContain("productId doesn't exist");
      });

      it('should return 400 status code if sourceStartDate is later than sourceEndDate', async function () {
        // Part 1 - preparing data
        const metadata = createFakeMetadataRecord();
        const temp = metadata.sourceDateStart;
        metadata.sourceDateStart = metadata.sourceDateEnd;
        metadata.sourceDateEnd = temp;
        const response = await requestSender.createRecord(app, metadata);
        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.text).toContain('sourceStartDate should not be later than sourceEndDate');
      });

      it('should return 400 status code if minResolutionMeter is bigger than maxResolutionMeter', async function () {
        // Part 1 - preparing data
        const metadata = createFakeMetadataRecord();
        const temp = metadata.minResolutionMeter;
        metadata.minResolutionMeter = metadata.maxResolutionMeter;
        metadata.maxResolutionMeter = temp;
        const response = await requestSender.createRecord(app, metadata);
        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.text).toContain('minResolutionMeter should not be bigger than maxResolutionMeter');
      });
    });

    describe('Sad Path 😥', function () {
      it('should return 500 status code if a db exception happens', async function () {
        const metadata = createFakeMetadataRecord();
        const findMock = jest.fn();
        const saveMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ save: saveMock, findOne: findMock });

        const response = await requestSender.createRecord(mockedApp, metadata);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });

      // it('should return 500 status code if identifier already exists', async function () {
      //   const metadata = createFakeMetadataEntity();
      //   const getMock = jest.fn().mockResolvedValue(metadata);
      //   const mockedApp = requestSender.getMockedRepoApp({ get: getMock });

      //   const response = await requestSender.createRecord(mockedApp, metadata);

      //   expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
      //   expect(response.body).toHaveProperty('message', 'failed');
      // });
    });
  });

  describe('PUT /metadata/{identifier}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 200 status code and the updated metadata record', async function () {
        const metadata = createFakeMetadataRecord();
        const newResponse = await requestSender.createRecord(app, metadata);
        expect(newResponse.status).toBe(httpStatusCodes.CREATED);
        expect(newResponse.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        const body = (newResponse.body as unknown) as IMetadataEntity;
        body.classification = '4';

        const response = await requestSender.updateRecord(app, body.identifier, body);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(body);
      });
    });

    describe('Bad Path 😡', function () {
      // No bad paths here!
    });

    describe('Sad Path 😥', function () {
      it('should return 404 status code if the metadata record does not exist', async function () {
        const metadata = createFakeMetadataEntity();

        const response = await requestSender.updateRecord(app, metadata.identifier, metadata);

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message', `Metadata record ${metadata.identifier} does not exist`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const metadata = createFakeMetadataEntity();
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.updateRecord(mockedApp, metadata.identifier, metadata);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('PATCH /metadata/{identifier}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 200 status code and the updated metadata record', async function () {
        const metadata = createFakeMetadataRecord();
        const updatedPayload = getUpdatePayload();
        const newResponse = await requestSender.createRecord(app, metadata);
        expect(newResponse.status).toBe(httpStatusCodes.CREATED);
        expect(newResponse.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        const body = (newResponse.body as unknown) as IMetadataEntity;

        const response = await requestSender.updatePartialRecord(app, body.identifier, updatedPayload);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(body);
      });
    });

    describe('Bad Path 😡', function () {
      // No bad paths here!
    });

    describe('Sad Path 😥', function () {
      it('should return 404 status code if the metadata record does not exist', async function () {
        const metadata = createFakeMetadataEntity();
        const payload = getUpdatePayload();

        const response = await requestSender.updatePartialRecord(app, metadata.identifier, payload);

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message', `Metadata record ${metadata.identifier} does not exist`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const metadata = createFakeMetadataEntity();
        const payload = getUpdatePayload();
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.updatePartialRecord(mockedApp, metadata.identifier, payload);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('DELETE /metadata/{identifier}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 204 status code if metadata record to be deleted was not in the database', async function () {
        const response = await requestSender.deleteRecord(app, '1');

        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });

      it('should return 204 status code if metadata record was found and deleted successfully', async function () {
        const metadata = createFakeMetadataRecord();
        const record = (await requestSender.createRecord(app, metadata)).body as IMetadataEntity;

        const response = await requestSender.deleteRecord(app, record.identifier);

        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });
    });

    describe('Bad Path 😡', function () {
      // No bad paths here!
    });

    describe('Sad Path 😥', function () {
      it('should return 500 status code if a db exception happens', async function () {
        const deleteMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ delete: deleteMock });

        const response = await requestSender.deleteRecord(mockedApp, '1');

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });
});
