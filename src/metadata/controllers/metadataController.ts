import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Services } from '../../common/constants';
import { HttpError } from '../../common/errors';
import { ILogger } from '../../common/interfaces';
import { IdAlreadyExistsError } from '../models/errors';
import { MetadataManager } from '../models/metadataManager';
import { IMetadata } from '../models/metadata';

type GetAllRequestHandler = RequestHandler<undefined, IMetadata[]>;
type CreateRequestHandler = RequestHandler<undefined, IMetadata, IMetadata>;

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
}
