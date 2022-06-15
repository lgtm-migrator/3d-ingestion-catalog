import * as turf from '@turf/turf';
import wkt from 'terraformer-wkt-parser';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';
import { Logger } from '@map-colonies/js-logger';
import { SERVICES } from '../../common/constants';
import { HttpError, NotFoundError } from '../../common/errors';
import { EntityNotFoundError, IdAlreadyExistsError } from '../models/errors';
import { MetadataManager } from '../models/metadataManager';
import { getAnyTextValue } from '../../common/anytext';
<<<<<<< HEAD
import { checkValidationValues } from './check';
import { BadValues, IdNotExists } from './errors';

interface MetadataParams {
  identifier: string;
}
type GetAllRequestHandler = RequestHandler<undefined, IMetadataExternal[]>;
type GetRequestHandler = RequestHandler<MetadataParams, IMetadataExternal>;
type CreateRequestHandler = RequestHandler<undefined, IMetadataExternal, IMetadataPayload>;
type UpdateRequestHandler = RequestHandler<MetadataParams, IMetadataExternal, IMetadataExternal>;
type UpdatePartialRequestHandler = RequestHandler<MetadataParams, IMetadataExternal, IUpdatePayload>;
=======
import { Metadata } from '../models/generated';
import { IPayload, IUpdatePayload, MetadataParams } from '../../common/dataModels/records';
import { linksToString, formatStrings } from '../../common/utils/format';

//Changed
type GetAllRequestHandler = RequestHandler<undefined, Metadata[]>;
type GetRequestHandler = RequestHandler<MetadataParams, Metadata, number>;
type CreateRequestHandler = RequestHandler<undefined, Metadata, IPayload>;
type UpdateRequestHandler = RequestHandler<MetadataParams, Metadata, IPayload>;
type UpdatePartialRequestHandler = RequestHandler<MetadataParams, Metadata, IUpdatePayload>;
>>>>>>> origin/master
type DeleteRequestHandler = RequestHandler<MetadataParams>;

@injectable()
export class MetadataController {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger, private readonly manager: MetadataManager) {}

  public getAll: GetAllRequestHandler = async (req, res, next) => {
    try {
      const metadataList = await this.manager.getAll();
      if (!metadataList || metadataList.length == 0) {
        return res.sendStatus(httpStatus.NO_CONTENT);
      }
      return res.status(httpStatus.OK).json(metadataList);
    } catch (error) {
      return next(error);
    }
  };

  public get: GetRequestHandler = async (req, res, next) => {
    try {
      const { identifier } = req.params;
      const metadata: Metadata | undefined = await this.manager.getRecord(identifier);
      if (!metadata) {
        const error = new NotFoundError('Metadata record with given identifier was not found.');
        return next(error);
      }
      return res.status(httpStatus.OK).json(metadata);
    } catch (error) {
      return next(error);
    }
  };

  public post: CreateRequestHandler = async (req, res, next) => {
    try {
<<<<<<< HEAD
      const payload = req.body;
      const identifier = uuidV4();
      if (await this.manager.getRecord(identifier)) {
        throw new IdAlreadyExistsError('identifier already exists');
      }
      if (payload.productId != undefined) {
        if (!(await this.manager.getRecord(payload.productId))) {
          throw new IdNotExists("productId doesn't exist");
        }
      } else {
        payload.productId = identifier;
      }
      const metadata: IMetadataEntity = {
        ...payload,
        identifier: identifier,
        insertDate: new Date(),
        type: 'RECORD_3D',
        typeName: 'undefined',
        schema: 'undefined',
        mdSource: 'undefined',
        xml: 'undefined',
        anytext: getAnyTextValue(payload),
        keywords: '3d',
        productBoundingBox: turf.bbox(payload.footprint).toString(),
        boundingBox: wkt.convert(payload.footprint),
        productVersion: (await this.manager.findLastVersion(payload.productId)) + 1,
      };

      checkValidationValues(metadata);
      const createdMetadata = await this.manager.createRecord(Object.assign(new Metadata(), metadata));
=======
      const payload: IPayload = formatStrings(req.body);
      const metadata = await this.metadataToEntity(payload);

      const createdMetadata = await this.manager.createRecord(metadata);
>>>>>>> origin/master
      return res.status(httpStatus.CREATED).json(createdMetadata);
    } catch (error) {
      if (error instanceof BadValues || error instanceof IdNotExists) {
        (error as HttpError).status = httpStatus.BAD_REQUEST;
        return error;
      }
      return next(error);
    }
  };

  public put: UpdateRequestHandler = async (req, res, next) => {
    try {
      const { identifier } = req.params;
      const payload: IPayload = formatStrings(req.body);
      const metadata = await this.metadataToEntity(payload);
      const updatedMetadata = await this.manager.updateRecord(identifier, metadata);
      return res.status(httpStatus.OK).json(updatedMetadata);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        (error as HttpError).status = httpStatus.NOT_FOUND;
      }
      return next(error);
    }
  };

<<<<<<< HEAD
  // public patch: UpdatePartialRequestHandler = async (req, res, next) => {
  //   try {
  //     const { identifier } = req.params;
  //     const metadata = await this.manager.updatePartialRecord(identifier, req.body);
  //     return res.status(httpStatus.OK).json(metadata);
  //   } catch (error) {
  //     if (error instanceof EntityNotFoundError) {
  //       (error as HttpError).status = httpStatus.NOT_FOUND;
  //     }
  //     return next(error);
  //   }
  // };
=======
  public patch: UpdatePartialRequestHandler = async (req, res, next) => {
    try {
      const { identifier } = req.params;
      const payload: IUpdatePayload = req.body;
      const updatedPartialMetadata = await this.manager.updatePartialRecord(identifier, payload);
      return res.status(httpStatus.OK).json(updatedPartialMetadata);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        (error as HttpError).status = httpStatus.NOT_FOUND;
      }
      return next(error);
    }
  };
>>>>>>> origin/master

  public delete: DeleteRequestHandler = async (req, res, next) => {
    try {
      const { identifier } = req.params;
      await this.manager.deleteRecord(identifier);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  };

  private async metadataToEntity(metadata: IPayload): Promise<Metadata> {
    const entity: Metadata = new Metadata();
    Object.assign(entity, metadata);

    entity.id = uuidV4();
    if (metadata.productId != undefined) {
      entity.productVersion = (await this.manager.findLastVersion(metadata.productId)) + 1;
    } else {
      entity.productVersion = 1;
      entity.productId = entity.id;
    }

    if (metadata.footprint !== undefined) {
      entity.wktGeometry = wkt.convert(metadata.footprint as GeoJSON.Geometry);
      entity.productBoundingBox = turf.bbox(metadata.footprint).toString();
    }

    entity.sensors = metadata.sensors ? metadata.sensors.join(', ') : '';
    entity.region = metadata.region ? metadata.region.join(', ') : '';
    entity.links = linksToString(metadata.links);

    entity.anyText = getAnyTextValue(metadata);

    entity.updateDate = new Date();
    entity.insertDate = new Date();

    return entity;
  }
}
