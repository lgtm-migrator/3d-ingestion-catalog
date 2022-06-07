import { container } from 'tsyringe';
import { Connection, EntityTarget, Repository } from 'typeorm';
import { createFakeEntity } from '../../../../helpers/helpers';
// import { IMetadataEntity } from '../../../../../src/metadata/models/metadata';
import { Metadata } from '../../../../../src/metadata/models/generated';

export const getRepositoryFromContainer = <T>(target: EntityTarget<T>): Repository<T> => {
  const connection = container.resolve(Connection);
  return connection.getRepository<T>(target);
};

export const createDbMetadataRecord = async (): Promise<Metadata> => {
  const repository = getRepositoryFromContainer(Metadata);
  const metadata = createFakeEntity();
  let entity;
  try {
    entity = await repository.save(metadata);
  } catch (err) {
    console.error(err);
    throw err;
  }
  return entity;
};
