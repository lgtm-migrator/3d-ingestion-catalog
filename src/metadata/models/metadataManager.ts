import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Logger } from '@map-colonies/js-logger';
import { SERVICES } from '../../common/constants';
<<<<<<< HEAD
import { EntityNotFoundError } from './errors';
import { IUpdatePayload, IMetadataEntity, IMetadataPayload } from './metadata';
import { Metadata } from './metadata.entity';
=======
import { EntityNotFoundError, IdAlreadyExistsError } from './errors';
import { Metadata } from './generated';
>>>>>>> origin/master

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
<<<<<<< HEAD
    const newMetadata = await this.repository.save(payload);
    return newMetadata;
  }

  public async updateRecord(identifier: string, payload: Partial<IMetadataPayload>): Promise<IMetadataEntity> {
    this.logger.info(`Update metadata record ${identifier}: ${JSON.stringify(payload)}`);
    const ifExists = await this.repository.findOne(identifier);
    if (ifExists == undefined) {
=======
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
>>>>>>> origin/master
      throw new EntityNotFoundError(`Metadata record ${identifier} does not exist`);
    }
    const newMetadata: Partial<Metadata> = { ...payload, id: identifier };
    const updatedMetadata = await this.repository.save(newMetadata);
    return updatedMetadata;
  }

<<<<<<< HEAD
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
=======
  public async updatePartialRecord(identifier: string, payload: Partial<Metadata>): Promise<Metadata> {
    this.logger.info(`Update partial metadata record ${identifier}: ${JSON.stringify(payload)}`);
    const dbMetadata: Metadata | undefined = await this.repository.findOne(identifier);
    if (dbMetadata == undefined) {
      throw new EntityNotFoundError(`Metadata record ${identifier} does not exist`);
    }
    const metadata: Metadata = { ...dbMetadata, ...payload, id: identifier };
    delete metadata.anyTextTsvector;
    delete metadata.wkbGeometry;
    const updatedMetadata: Metadata = await this.repository.save(metadata);
    return updatedMetadata;
  }
>>>>>>> origin/master

  public async deleteRecord(identifier: string): Promise<void> {
    this.logger.info(`Delete metadata record ${identifier}`);
    await this.repository.delete(identifier);
  }

  public async findLastVersion(identifier: string): Promise<number> {
    this.logger.info(`Get last product version record ${identifier}`);
    const metadata: Metadata | undefined = await this.repository.findOne({ where: { productId: identifier }, order: { productVersion: 'DESC' } });
<<<<<<< HEAD
    return metadata ? metadata.productVersion : 0;
=======
    return metadata !== undefined ? metadata.productVersion : 0;
>>>>>>> origin/master
  }
}
