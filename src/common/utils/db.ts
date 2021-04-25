import config from 'config';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Metadata } from '../../metadata/models/metadata';

export const ENTITIES_DIRS = [Metadata, 'src/metadata/models/*.ts'];

export const initializeConnection = async (): Promise<Connection> => {
  const connectionOptions = config.get<ConnectionOptions>('db');
  return createConnection({ entities: ENTITIES_DIRS, ...connectionOptions });
};
