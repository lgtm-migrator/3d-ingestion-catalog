import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';
import { Services } from '../../common/constants';
import { HttpError, NotFoundError } from '../../common/errors';
import { ILogger } from '../../common/interfaces';
import { EntityNotFoundError, IdAlreadyExistsError } from '../models/errors';
import { MetadataManager } from '../models/metadataManager';
import { IUpdatePayload, IMetadataEntity, IMetadataExternal, IMetadataPayload } from '../models/metadata';
import { Metadata } from '../models/metadata.entity';

interface MetadataParams {
  identifier: string;
}
//Changed
type GetAllRequestHandler = RequestHandler<undefined, IMetadataExternal[]>; 
type GetRequestHandler = RequestHandler<MetadataParams, IMetadataExternal>;
type CreateRequestHandler = RequestHandler<undefined, IMetadataExternal, IMetadataPayload>;
type UpdateRequestHandler = RequestHandler<MetadataParams, IMetadataExternal, IMetadataExternal>;
type UpdatePartialRequestHandler = RequestHandler<MetadataParams, IMetadataExternal, IUpdatePayload>;
type DeleteRequestHandler = RequestHandler<MetadataParams>;

@injectable()
export class MetadataController {
  public constructor(@inject(Services.LOGGER) private readonly logger: ILogger, private readonly manager: MetadataManager) {}

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
      const payload = req.body;
      const metadata: IMetadataEntity = {
        ...payload,
        id: uuidV4(),
        insertDate: new Date(),
        type: 'RECORD_3D',
        typeName: 'unefined',
        schema: 'undefined',
        mdSource: 'undefined',
        xml: 'undefined',
        anytext: this.getAnyTextValue(payload),
        keywords: '3d'
      }




      const createdMetadata = await this.manager.createRecord(Object.assign(new Metadata(), metadata));
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
      const metadata = await this.manager.updateRecord(identifier, req.body);
      return res.status(httpStatus.OK).json(metadata);
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
      const metadata = await this.manager.updatePartialRecord(identifier, req.body);
      return res.status(httpStatus.OK).json(metadata);
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

  private getAnyTextValue(payload: IMetadataPayload): string {
    const filteredKeys = ['creationDate','sourceDateStart','sourceDateEnd','footprint','links', 'boundingBox'];
    return Object.entries(payload).filter(([key, value]) => 
      !filteredKeys.includes(key) && 
      value !== undefined && 
      typeof(value) === 'string')
    .map(([, value]) => value as string)
    .join(' ')

  } 
}


