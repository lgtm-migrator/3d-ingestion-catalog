import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { Services } from '../../common/constants';
import { ILogger } from '../../common/interfaces';
import { formatLinks } from '../../common/utils/format';
import { EntityNotFoundError, IdAlreadyExistsError } from './errors';
import { IMetadata, Metadata, IPayload, IUpdatePayload } from './metadata';

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

  public async createRecord(payload: IPayload): Promise<IMetadata> {
    this.logger.log('info', `Create a new metadata record: ${JSON.stringify(payload)}`);
    const dbMetadata = await this.repository.findOne({ where: [{ identifier: payload.identifier }] });
    if (dbMetadata != undefined) {
      throw new IdAlreadyExistsError(`Metadata record ${dbMetadata.identifier} already exists`);
    }
    const metadata = { ...payload, links: formatLinks(payload.links) };
    const newMetadata = await this.repository.save(metadata);
    return newMetadata;
  }

  public async updateRecord(identifier: string, payload: IPayload): Promise<IMetadata> {
    this.logger.log('info', `Update metadata record ${identifier}: ${JSON.stringify(payload)}`);
    const dbMetadata = await this.repository.findOne(identifier);
    if (dbMetadata == undefined) {
      throw new EntityNotFoundError(`Metadata record ${identifier} does not exist`);
    }
    const metadata = { ...dbMetadata, ...payload, identifier, links: payload.links === undefined ? dbMetadata.links : formatLinks(payload.links) };
    delete metadata.anytextTsvector;
    delete metadata.wkbGeometry;
    const updatedMetadata = await this.repository.save(metadata);
    return updatedMetadata;
  }

  public async updatePartialRecord(identifier: string, payload: IUpdatePayload): Promise<IMetadata> {
    this.logger.log('info', `Update partial metadata record ${identifier}: ${JSON.stringify(payload)}`);
    const dbMetadata = await this.repository.findOne(identifier);
    if (dbMetadata == undefined) {
      throw new EntityNotFoundError(`Metadata record ${identifier} does not exist`);
    }
    const metadata = { ...dbMetadata, ...payload, identifier };
    delete metadata.anytextTsvector;
    delete metadata.wkbGeometry;
    const updatedMetadata = await this.repository.save(metadata);
    return updatedMetadata;
  }

  public async deleteRecord(identifier: string): Promise<void> {
    this.logger.log('info', `Delete metadata record ${identifier}`);
    await this.repository.delete(identifier);
  }
}
