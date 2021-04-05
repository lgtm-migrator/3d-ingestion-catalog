import { container } from 'tsyringe';
import { Connection, EntityTarget, Repository } from 'typeorm';
import { createFakeMetadataRecord } from '../../../../helpers/helpers';
import { IMetadata, Metadata } from '../../../../../src/metadata/models/metadata';

export const getRepositoryFromContainer = <T>(target: EntityTarget<T>): Repository<T> => {
  const connection = container.resolve(Connection);
  return connection.getRepository<T>(target);
};

export const createDbMetadataRecord = async (): Promise<IMetadata> => {
  const repository = getRepositoryFromContainer(Metadata);
  const createdMetadata = repository.create(createFakeMetadataRecord());
  return repository.save(createdMetadata);
};
