import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Logger } from '@map-colonies/js-logger';
import { SERVICES } from '../../common/constants';
import { IUpdateMetadata } from '../../common/dataModels/records';
import { EntityNotFoundError, IdAlreadyExistsError } from './errors';
import { Metadata } from './generated';

@injectable()
export class MetadataManager {
  public constructor(
    @inject(SERVICES.METADATA_REPOSITORY) private readonly repository: Repository<Metadata>,
    @inject(SERVICES.LOGGER) private readonly logger: Logger
  ) {}

  public async getAll(): Promise<Metadata[] | undefined> {
    this.logger.info(`Get all models metadata`);
    return this.repository.find();
  }

  public async getRecord(identifier: string): Promise<Metadata | undefined> {
    this.logger.info(`Get metadata record ${identifier}`);
    return this.repository.findOne(identifier);
  }

  public async createRecord(payload: Metadata): Promise<Metadata> {
    this.logger.info(`Create a new metadata record: ${JSON.stringify(payload)}`);
    const ifExists: Metadata | undefined = await this.repository.findOne(payload.id);
    if (ifExists != undefined && payload.id) {
      throw new IdAlreadyExistsError(`Metadata record ${payload.id} already exists!`);
    }
    const newMetadata: Metadata = await this.repository.save(payload);
    return newMetadata;
  }

  public async updateRecord(identifier: string, payload: Metadata): Promise<Metadata> {
    this.logger.info(`Update metadata record ${identifier}: ${JSON.stringify(payload)}`);
    const ifExists: Metadata | undefined = await this.repository.findOne(identifier);
    if (ifExists == undefined && payload.id) {
      throw new EntityNotFoundError(`Metadata record ${identifier} does not exist`);
    }
    const newMetadata: Partial<Metadata> = { ...payload, id: identifier };
    const updatedMetadata = await this.repository.save(newMetadata);
    return updatedMetadata;
  }

  public async updatePartialRecord(payload: IUpdateMetadata): Promise<Metadata> {
    this.logger.info(`Update partial metadata record ${payload.id}: ${JSON.stringify(payload)}`);
    const dbMetadata: Metadata | undefined = await this.repository.findOne(payload.id);
    if (dbMetadata == undefined) {
      throw new EntityNotFoundError(`Metadata record ${payload.id} does not exist`);
    }
    const metadata: IUpdateMetadata = { ...dbMetadata, ...payload };

    const updatedMetadata: Metadata = await this.repository.save(metadata);
    return updatedMetadata;
  }

  public async deleteRecord(identifier: string): Promise<void> {
    this.logger.info(`Delete metadata record ${identifier}`);
    await this.repository.delete(identifier);
  }

  public async findLastVersion(identifier: string): Promise<number> {
    this.logger.info(`Get last product version record ${identifier}`);
    const metadata: Metadata | undefined = await this.repository.findOne({ where: { productId: identifier }, order: { productVersion: 'DESC' } });
    return metadata !== undefined ? metadata.productVersion : 0;
  }
}
