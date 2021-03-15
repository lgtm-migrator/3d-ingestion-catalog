import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';
import { Application } from 'express';
import { QueryFailedError, Repository } from 'typeorm';
import { Metadata } from '../../../../src/metadata/models/metadata';
import { convertTimestampToISOString, createFakeMetadata } from '../../../helpers/helpers';
import { registerTestValues } from '../../testContainerConfig';
import { createDbMetadata, getRepositoryFromContainer } from './helpers/db';
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
        const metadata = await createDbMetadata();

        const response = await requestSender.getAll(app);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toHaveLength(1);
        expect(response.body).toMatchObject([convertTimestampToISOString(metadata)]);
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

  describe('POST /metadata', function () {
    describe('Happy Path 🙂', function () {
      it('should return 201 status code and the added metadata record', async function () {
        const metadata = createFakeMetadata();

        const response = await requestSender.createMetadata(app, metadata);

        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        expect(response.body).toMatchObject(convertTimestampToISOString(metadata));
      });
    });

    describe('Bad Path 😡', function () {
      it('should return 400 status code and error message if mandatory fields are missing', async function () {
        const metadata = createFakeMetadata();
        delete metadata.productId;
        delete metadata.productName;
        delete metadata.geographicArea;
        delete metadata.productVersion;
        delete metadata.productType;
        delete metadata.extentLowerLeft;
        delete metadata.extentUpperRight;
        delete metadata.SourceDateStart;
        delete metadata.SourceDateEnd;
        delete metadata.producerName;
        delete metadata.SRS;
        delete metadata.accuracyLE90;
        delete metadata.horizontalAccuracyCE90;
        delete metadata.relativeAccuracyLE90;
        delete metadata.sensor;
        delete metadata.productionSystem;

        const response = await requestSender.createMetadata(app, metadata);

        expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(response.body).toHaveProperty(
          'message',
          "request.body should have required property 'productId', request.body should have required property 'productName', request.body should have required property 'geographicArea', request.body should have required property 'extentLowerLeft', request.body should have required property 'extentUpperRight', request.body should have required property 'SourceDateStart', request.body should have required property 'SourceDateEnd', request.body should have required property 'SRS', request.body should have required property 'accuracyLE90', request.body should have required property 'horizontalAccuracyCE90', request.body should have required property 'relativeAccuracyLE90', request.body should have required property 'sensor', request.body should have required property 'productionSystem'"
        );
      });
    });

    describe('Sad Path 😥', function () {
      it('should return 422 status code if a job with the same id exists', async function () {
        const metadata = createFakeMetadata();
        const findMock = jest.fn().mockResolvedValue(metadata);
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.createMetadata(mockedApp, metadata);

        expect(response.status).toBe(httpStatusCodes.UNPROCESSABLE_ENTITY);
        expect(response.body).toHaveProperty('message', `Metadata record ${metadata.productId} already exists`);
      });

      it('should return 500 status code if a db exception happens', async function () {
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockedRepoApp({ findOne: findMock });

        const response = await requestSender.createMetadata(mockedApp, createFakeMetadata());

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });
});
