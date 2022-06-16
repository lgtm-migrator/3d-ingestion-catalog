import { container } from 'tsyringe';
import config from 'config';
import jsLogger from '@map-colonies/js-logger';
import { Connection } from 'typeorm';
import { SERVICES } from '../../src/common/constants';
import { Metadata } from '../../src/metadata/models/generated';
import { initializeConnection } from '../../src/common/utils/db';
import { DbConfig } from '../../src/common/interfaces';

async function registerTestValues(): Promise<void> {
  container.register(SERVICES.CONFIG, { useValue: config });

  container.register(SERVICES.LOGGER, { useValue: jsLogger({ enabled: false }) });

  const connection = await initializeConnection(config.get<DbConfig>('test'));
  await connection.synchronize();
  const repository = connection.getRepository(Metadata);
  container.register(Connection, { useValue: connection });
  container.register(SERVICES.METADATA_REPOSITORY, { useValue: repository });
}

export { registerTestValues };
