import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';
import { Application } from 'express';
import { QueryFailedError, Repository } from 'typeorm';
import { Metadata } from '../../../../src/metadata/models/metadata.entity';
import { IMetadataEntity } from '../../../../src/metadata/models/metadata';
import { convertObjectToResponse, createFakeMetadataRecord, getPayload, getUpdatePayload } from '../../../helpers/helpers';
import { registerTestValues } from '../../testContainerConfig';
import { createDbMetadataRecord, getRepositoryFromContainer } from './helpers/db';
import * as requestSender from './helpers/requestSender';

describe('MetadataController', function () {
  let app: Application;
  let repository: Repository<Metadata>;

  beforeAll(async function () {
    await registerTestValues();
    app = requestSender.getApp();
    repository = getRepositoryFromContainer(Metadata);
    await repository.clear();
  });

  afterAll(function () {
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
        const payload = getPayload(metadata);

        const createResponse = await requestSender.createRecord(app, payload);
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
        const payload = getPayload(metadata);

        const createResponse = await requestSender.createRecord(app, payload);
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
        // const metadata = createFakeMetadataRecord();
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);
        const response = await requestSender.createRecord(app, payload);
        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');

        const body = (response.body as unknown) as IMetadataEntity;
        const getResponse = await requestSender.getRecord(app, body.identifier);
        const { anytextTsvector, wkbGeometry, ...createdResponseBody } = body;

        expect(getResponse.body).toMatchObject(createdResponseBody);
        expect(createdResponseBody.productVersion).toBe(1);
      });

      it('if productId exists, should return 201 status code and the added metadata record when productVersion is + 1', async function () {
        // const metadata = createFakeMetadataRecord();
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);
        const response = await requestSender.createRecord(app, payload);
        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        const oldBody = (response.body as unknown) as IMetadataEntity;
        payload.productId = oldBody.productId;
        const newResponse = await requestSender.createRecord(app, payload);
        expect(newResponse.status).toBe(httpStatusCodes.CREATED);
        expect(newResponse.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        const body = (newResponse.body as unknown) as IMetadataEntity;

        const getResponse = await requestSender.getRecord(app, body.identifier);
        const { anytextTsvector, wkbGeometry, ...createdResponseBody } = body;

        expect(getResponse.body).toMatchObject(createdResponseBody);
        expect(createdResponseBody.productId).toBe(oldBody.productId);
        expect(createdResponseBody.productVersion).toBe(Number(oldBody.productVersion) + 1);

        //   const response = await requestSender.createRecord(mockedApp, payload);

        //   expect(response.status).toBe(httpStatusCodes.UNPROCESSABLE_ENTITY);
        //   expect(response.body).toHaveProperty('message', `Metadata record ${metadata.identifier} already exists`);
      });
    });

    describe('Bad Path 😡', function () {
      // The code doesn't cover required fields in spec.
      // it.only('should return 400 status code and error message if mandatory fields are missing', async function () {
      //   const metadata = createFakeMetadataRecord();
      //   const { producerName, accuracyLE90, ...payload } = getPayload(metadata);
      //   const response = await requestSender.createRecord(app, payload as IMetadataPayload);
      //   expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
      //   expect(response.body).toHaveProperty(
      //     'message',
      //     "request.body should have required property 'producerName', request.body should have required property 'accuracyLE90'"
      //   );
      // });
    });

    describe('Sad Path 😥', function () {
      it('should return 422 status code if a metadata record with the same id already exists', async function () {
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);
        const findMock = jest.fn().mockResolvedValue(metadata);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.createRecord(mockedApp, payload);

        expect(response.status).toBe(httpStatusCodes.UNPROCESSABLE_ENTITY);
        expect(response.body).toHaveProperty('message', `Metadata record ${metadata.identifier} already exists`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.createRecord(mockedApp, payload);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('PUT /metadata/{identifier}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 200 status code and the updated metadata record', async function () {
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);
        // payload.productVersion = 2;
        const findMock = jest.fn().mockResolvedValue(metadata);
        metadata.classification = '4';
        const saveMock = jest.fn().mockResolvedValue(metadata);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock, save: saveMock });

        const response = await requestSender.updateRecord(mockedApp, metadata.identifier, payload);

        const { wkbGeometry, ...updated } = convertObjectToResponse(metadata);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(updated);
      });
    });

    describe('Bad Path 😡', function () {
      // No bad paths here!
    });

    describe('Sad Path 😥', function () {
      it('should return 404 status code if the metadata record does not exist', async function () {
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);
        const findMock = jest.fn().mockResolvedValue(undefined);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.updateRecord(mockedApp, metadata.identifier, payload);

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message', `Metadata record ${metadata.identifier} does not exist`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.updateRecord(mockedApp, metadata.identifier, payload);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('PATCH /metadata/{identifier}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 200 status code and the updated metadata record', async function () {
        let metadata = createFakeMetadataRecord();
        const payload = getUpdatePayload();
        const findMock = jest.fn().mockResolvedValue(metadata);
        metadata = { ...metadata, ...payload };
        const saveMock = jest.fn().mockResolvedValue(metadata);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock, save: saveMock });

        const response = await requestSender.updatePartialRecord(mockedApp, metadata.identifier, payload);

        const { wkbGeometry, ...updated } = convertObjectToResponse(metadata);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(updated);
      });
    });

    describe('Bad Path 😡', function () {
      // No bad paths here!
    });

    describe('Sad Path 😥', function () {
      it('should return 404 status code if the metadata record does not exist', async function () {
        const metadata = createFakeMetadataRecord();
        const payload = getUpdatePayload();
        const findMock = jest.fn().mockResolvedValue(undefined);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.updatePartialRecord(mockedApp, metadata.identifier, payload);

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response.body).toHaveProperty('message', `Metadata record ${metadata.identifier} does not exist`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const metadata = createFakeMetadataRecord();
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
        const payload = getPayload(metadata);
        await requestSender.createRecord(app, payload);

        const response = await requestSender.deleteRecord(app, metadata.identifier);

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
