import { container } from 'tsyringe';
import config from 'config';
import { Connection } from 'typeorm';
import { SERVICES } from '../../src/common/constants';
import { Metadata } from '../../src/metadata/models/metadata';
import { ILogger } from '../../src/common/interfaces';
import { initializeConnection } from '../../src/common/utils/db';

async function registerTestValues(): Promise<void> {
  container.register(SERVICES.CONFIG, { useValue: config });

  const mockLogger: ILogger = { log: jest.fn() };
  container.register(SERVICES.LOGGER, { useValue: mockLogger });

  const connection = await initializeConnection();
  // await connection.synchronize();
  const repository = connection.getRepository(Metadata);
  container.register(Connection, { useValue: connection });
  container.register(SERVICES.METADATA_REPOSITORY, { useValue: repository });
}

export { registerTestValues };
