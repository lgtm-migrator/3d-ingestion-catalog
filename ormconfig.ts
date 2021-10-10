import config from 'config';
import { createConnectionOptions } from './src/common/utils/db';
import { DbConfig } from './src/common/interfaces';

const connectionOptions = config.get<DbConfig>('db');

module.exports = {
  ...createConnectionOptions(connectionOptions),
  entities: ['src/metadata/models/*.ts'],
  migrationsTableName: 'metadata_migration_table',
  migrations: ['db/migration/*.ts'],
  cli: {
    migrationsDir: 'db/migration',
  }
};
