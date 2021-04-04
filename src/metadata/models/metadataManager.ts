import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { EntityNotFoundError, IdAlreadyExistsError } from './errors';
import { IMetadata, Metadata } from './metadata';

@injectable()
export class MetadataManager {
  public constructor(
    @inject(Services.REPOSITORY) private readonly repository: Repository<Metadata>,
    @inject(Services.LOGGER) private readonly logger: ILogger
  ) {}

  public async getAll(): Promise<IMetadata[] | undefined> {
    this.logger.log('info', `Get all models metadata`);
    return this.repository.find();
  }

  public async getRecord(identifier: string): Promise<IMetadata | undefined> {
    this.logger.log('info', `Get metadata record ${identifier}`);
    return this.repository.findOne(identifier);
  }

  public async createRecord(newMetadata: IMetadata): Promise<IMetadata> {
    this.logger.log('info', `Create a new metadata record: ${JSON.stringify(newMetadata)}`);
    const dbMetadata = await this.repository.findOne({ where: [{ identifier: newMetadata.identifier }] });
    if (dbMetadata != undefined) {
      throw new IdAlreadyExistsError(`Metadata record ${dbMetadata.identifier} already exists`);
    }
    await this.repository.insert(newMetadata);
    return newMetadata;
  }

  public async updateRecord(identifier: string, metadata: IMetadata): Promise<IMetadata> {
    this.logger.log('info', `Update metadata record ${identifier}: ${JSON.stringify(metadata)}`);
    const dbMetadata = await this.repository.findOne(identifier);
    if (dbMetadata == undefined) {
      throw new EntityNotFoundError(`Metadata record ${identifier} does not exist`);
    }
    const updatedMetadata = await this.repository.save(metadata);
    return updatedMetadata;
  }

  public async deleteRecord(identifier: string): Promise<void> {
    this.logger.log('info', `Delete metadata record ${identifier}`);
    await this.repository.delete(identifier);
  }
}
