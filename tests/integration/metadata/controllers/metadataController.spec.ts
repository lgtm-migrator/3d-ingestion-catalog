import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';
import { Application } from 'express';
import { QueryFailedError, Repository } from 'typeorm';
import { Metadata } from '../../../../src/metadata/models/metadata';
import { convertObjectToResponse, createFakeMetadataRecord, getPayload } from '../../../helpers/helpers';
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
        const metadata = await createDbMetadataRecord();

        const response = await requestSender.getAll(app);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toHaveLength(1);
        expect(response.body).toMatchObject([convertObjectToResponse(metadata)]);
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
        const metadata = await createDbMetadataRecord();

        const response = await requestSender.getRecord(app, metadata.identifier);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(convertObjectToResponse(metadata));
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
      it('should return 201 status code and the added metadata record', async function () {
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);

        const response = await requestSender.createRecord(app, payload);

        const created = convertObjectToResponse(metadata);
        delete created.anytextTsvector;
        delete created.wkbGeometry;

        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(created);
      });
    });

    describe('Bad Path 😡', function () {
      it('should return 400 status code and error message if mandatory fields are missing', async function () {
        const metadata = createFakeMetadataRecord();
        const payload = getPayload(metadata);
        delete payload.identifier;
        delete payload.typename;
        delete payload.schema;
        delete payload.mdSource;
        delete payload.xml;
        delete payload.anytext;
        delete payload.insertDate;

        const response = await requestSender.createRecord(app, payload);

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty(
          'message',
          "request.body should have required property 'identifier', request.body should have required property 'typename', request.body should have required property 'schema', request.body should have required property 'mdSource', request.body should have required property 'xml', request.body should have required property 'anytext', request.body should have required property 'insertDate'"
        );
      });
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
        payload.version = '2';
        const findMock = jest.fn().mockResolvedValue(metadata);
        metadata.version = '2';
        const saveMock = jest.fn().mockResolvedValue(metadata);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock, save: saveMock });

        const response = await requestSender.updateRecord(mockedApp, metadata.identifier, payload);

        const updated = convertObjectToResponse(metadata);
        delete updated.wkbGeometry;

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

  describe('DELETE /metadata/{identifier}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 204 status code if metadata record to be deleted was not in the database', async function () {
        const response = await requestSender.deleteRecord(app, '1');

        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });

      it('should return 204 status code if metadata record was found and deleted successfully', async function () {
        const metadata = await createDbMetadataRecord();

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
