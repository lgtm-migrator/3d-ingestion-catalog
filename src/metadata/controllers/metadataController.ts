import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Services } from '../../common/constants';
import { HttpError, NotFoundError } from '../../common/errors';
import { ILogger } from '../../common/interfaces';
import { EntityNotFoundError, IdAlreadyExistsError } from '../models/errors';
import { MetadataManager } from '../models/metadataManager';
import { IMetadata, Payload } from '../models/metadata';

interface MetadataParams {
  identifier: string;
}

type GetAllRequestHandler = RequestHandler<undefined, IMetadata[]>;
type GetRequestHandler = RequestHandler<MetadataParams, IMetadata>;
type CreateRequestHandler = RequestHandler<undefined, IMetadata, Payload>;
type UpdateRequestHandler = RequestHandler<MetadataParams, IMetadata, Payload>;
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
      const metadata = await this.manager.createRecord(req.body);
      return res.status(httpStatus.CREATED).json(metadata);
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

  public delete: DeleteRequestHandler = async (req, res, next) => {
    try {
      const { identifier } = req.params;
      await this.manager.deleteRecord(identifier);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  };
}
