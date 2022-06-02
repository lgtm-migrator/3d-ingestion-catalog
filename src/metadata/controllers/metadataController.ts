/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as turf from '@turf/turf';
import wkt from 'terraformer-wkt-parser';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';
import { Logger } from '@map-colonies/js-logger';
import { Link, I3DCatalogUpsertRequestBody } from '@map-colonies/mc-model-types';
import { SERVICES } from '../../common/constants';
import { HttpError, NotFoundError } from '../../common/errors';
import { EntityNotFoundError, IdAlreadyExistsError } from '../models/errors';
import { MetadataManager } from '../models/metadataManager';
import { getAnyTextValue } from '../../common/anytext';
import { Metadata } from '../models/generated';

interface MetadataParams {
  identifier: string;
}
//Changed
type GetAllRequestHandler = RequestHandler<undefined, Metadata[], I3DCatalogUpsertRequestBody>;
type GetRequestHandler = RequestHandler<MetadataParams, Metadata, I3DCatalogUpsertRequestBody>;
type CreateRequestHandler = RequestHandler<undefined, Metadata, I3DCatalogUpsertRequestBody>;
type UpdateRequestHandler = RequestHandler<MetadataParams, Metadata, I3DCatalogUpsertRequestBody>;
type UpdatePartialRequestHandler = RequestHandler<MetadataParams, Metadata, I3DCatalogUpsertRequestBody>;
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
      const metadata = await this.manager.getRecord(identifier);
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
      const payload: I3DCatalogUpsertRequestBody = req.body;
      const metadata = await this.metadataToEntity(payload);

      const createdMetadata = await this.manager.createRecord(metadata);
      return res.status(httpStatus.CREATED).json(createdMetadata);
    } catch (error) {
      if (error instanceof IdAlreadyExistsError) {
        (error as HttpError).status = httpStatus.UNPROCESSABLE_ENTITY;
      }
      return next(error);
    }
  };

  public put: UpdateRequestHandler = async (req, res, next) => {
    try {
      const { identifier } = req.params;
      const payload: I3DCatalogUpsertRequestBody = req.body;
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

  public patch: UpdatePartialRequestHandler = async (req, res, next) => {
    try {
      const { identifier } = req.params;
      const payload: I3DCatalogUpsertRequestBody = req.body;
      const metadata = await this.metadataToEntity(payload);
      const updatedPartialMetadata = await this.manager.updatePartialRecord(identifier, metadata);
      return res.status(httpStatus.OK).json(updatedPartialMetadata);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        (error as HttpError).status = httpStatus.NOT_FOUND;
      }
      return next(error);
    }
  };

  public delete: DeleteRequestHandler = async (req, res, next) => {
    try {
      const { identifier } = req.params;
      await this.manager.deleteRecord(identifier);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  };

  private async metadataToEntity(metadata: I3DCatalogUpsertRequestBody): Promise<Metadata> {
    const entity = new Metadata();
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
      // entity.wkbGeometry = wktToGeojson(metadata.footprint);
      entity.productBoundingBox = turf.bbox(metadata.footprint).toString();
    }

    entity.sensors = metadata.sensors ? metadata.sensors.join(', ') : '';
    entity.region = metadata.region?.join(', ');
    entity.links = this.linksToString(metadata.links);

    entity.anyText = getAnyTextValue(metadata);
    
    entity.updateDate = new Date();
    entity.insertDate = new Date();

    return entity;
  }

  private linksToString(links: Link[]): string {
    const stringLinks = links.map((link) => `${link.name ?? ''}, ${link.description ?? ''}, ${link.protocol ?? ''}, ${link.url ?? ''}`);
    return stringLinks.join('^');
  }

}
