import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { IdAlreadyExistsError } from './errors';
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

  public async createRecord(newMetadata: IMetadata): Promise<IMetadata> {
    this.logger.log('info', `Create a new metadata record: ${JSON.stringify(newMetadata)}`);
    let dbMetadata = await this.repository.findOne({ where: [{ identifier: newMetadata.identifier }] });
    if (dbMetadata != undefined) {
      throw new IdAlreadyExistsError(`Metadata record ${dbMetadata.identifier} already exists`);
    }
    await this.repository.insert(newMetadata);
    return newMetadata;
  }
}
