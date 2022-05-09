import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Logger } from '@map-colonies/js-logger';
import { SERVICES } from '../../common/constants';
import { EntityNotFoundError } from './errors';
import { IUpdatePayload, IMetadataEntity, IMetadataPayload } from './metadata';
import { Metadata } from './metadata.entity';

@injectable()
export class MetadataManager {
  public constructor(
    @inject(SERVICES.METADATA_REPOSITORY) private readonly repository: Repository<Metadata>,
    @inject(SERVICES.LOGGER) private readonly logger: Logger
  ) {}

  public async getAll(): Promise<IMetadataEntity[] | undefined> {
    this.logger.info(`Get all models metadata`);
    return this.repository.find();
  }

  public async getRecord(identifier: string): Promise<IMetadataEntity | undefined> {
    this.logger.info(`Get metadata record ${identifier}`);
    return this.repository.findOne(identifier);
  }

  public async createRecord(payload: IMetadataEntity): Promise<IMetadataEntity> {
    this.logger.info(`Create a new metadata record: ${JSON.stringify(payload)}`);
    const newMetadata = await this.repository.save(payload);
    return newMetadata;
  }

  public async updateRecord(identifier: string, payload: Partial<IMetadataPayload>): Promise<IMetadataEntity> {
    this.logger.info(`Update metadata record ${identifier}: ${JSON.stringify(payload)}`);
    const ifExists = await this.repository.findOne(identifier);
    if (ifExists == undefined) {
      throw new EntityNotFoundError(`Metadata record ${identifier} does not exist`);
    }
    const newMetadata: Partial<IMetadataEntity> = { ...payload, identifier: identifier };
    const updatedMetadata = await this.repository.save(newMetadata);
    return updatedMetadata;
  }

  // public async updatePartialRecord(identifier: string, payload: IUpdatePayload): Promise<IMetadataEntity> {
  //   this.logger.info(`Update partial metadata record ${identifier}: ${JSON.stringify(payload)}`);
  //   const dbMetadata = await this.repository.findOne(identifier);
  //   if (dbMetadata == undefined) {
  //     throw new EntityNotFoundError(`Metadata record ${identifier} does not exist`);
  //   }
  //   const metadata = { ...dbMetadata, ...payload, id: identifier };
  //   delete metadata.anytextTsvector;
  //   delete metadata.wkbGeometry;
  //   const updatedMetadata = await this.repository.save(metadata);
  //   return updatedMetadata;
  // }

  public async deleteRecord(identifier: string): Promise<void> {
    this.logger.info(`Delete metadata record ${identifier}`);
    await this.repository.delete(identifier);
  }

  public async findLastVersion(identifier: string): Promise<number> {
    this.logger.info(`Get last product version record ${identifier}`);
    const metadata: Metadata | undefined = await this.repository.findOne({ where: { productId: identifier }, order: { productVersion: 'DESC' } });
    return metadata ? metadata.productVersion : 0;
  }
}
