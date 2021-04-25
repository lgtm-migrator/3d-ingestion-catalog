import { QueryFailedError, Repository } from 'typeorm';
import { EntityNotFoundError, IdAlreadyExistsError } from '../../../../src/metadata/models/errors';
import { Metadata } from '../../../../src/metadata/models/metadata';
import { MetadataManager } from '../../../../src/metadata/models/metadataManager';
import { createFakeMetadataRecord, getPayload } from '../../../helpers/helpers';

let metadataManager: MetadataManager;

describe('MetadataManager', () => {
  describe('#getAll', () => {
    const find = jest.fn();
    beforeEach(() => {
      const repository = ({ find } as unknown) as Repository<Metadata>;
      metadataManager = new MetadataManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      find.mockClear();
    });

    it('returns a metadata list', async () => {
      const metadata = createFakeMetadataRecord();
      find.mockResolvedValue([metadata]);

      const getPromise = metadataManager.getAll();

      await expect(getPromise).resolves.toStrictEqual([metadata]);
    });

    it('rejects on DB error', async () => {
      find.mockRejectedValue(new QueryFailedError('select *', [], new Error()));

      const getPromise = metadataManager.getAll();

      await expect(getPromise).rejects.toThrow(QueryFailedError);
    });

    it('returns undefined if table is empty', async () => {
      find.mockReturnValue(undefined);

      const getPromise = metadataManager.getAll();

      await expect(getPromise).resolves.toBeUndefined();
    });
  });

  describe('#getRecord', () => {
    const findOne = jest.fn();
    beforeEach(() => {
      const repository = ({ findOne } as unknown) as Repository<Metadata>;
      metadataManager = new MetadataManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      findOne.mockClear();
    });

    it('returns a metadata record', async () => {
      const metadata = createFakeMetadataRecord();
      findOne.mockResolvedValue(metadata);

      const getPromise = metadataManager.getRecord(metadata.identifier);

      await expect(getPromise).resolves.toStrictEqual(metadata);
    });

    it('rejects on DB error', async () => {
      findOne.mockRejectedValue(new QueryFailedError('select *', [], new Error()));

      const getPromise = metadataManager.getRecord('1');

      await expect(getPromise).rejects.toThrow(QueryFailedError);
    });

    it('returns undefined if table is empty', async () => {
      findOne.mockReturnValue(undefined);

      const getPromise = metadataManager.getRecord('1');

      await expect(getPromise).resolves.toBeUndefined();
    });
  });

  describe('#createRecord', () => {
    const save = jest.fn();
    const findOne = jest.fn();
    beforeEach(() => {
      const repository = ({ save, findOne } as unknown) as Repository<Metadata>;
      metadataManager = new MetadataManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('resolves without errors if id is not in use', async () => {
      const metadata = createFakeMetadataRecord();
      const payload = getPayload(metadata);
      findOne.mockResolvedValue(undefined);
      save.mockResolvedValue(metadata);

      const createPromise = metadataManager.createRecord(payload);

      await expect(createPromise).resolves.toStrictEqual(metadata);
    });

    it('rejects on DB error', async () => {
      const metadata = createFakeMetadataRecord();
      const payload = getPayload(metadata);
      findOne.mockRejectedValue(new QueryFailedError('select *', [], new Error()));

      const createPromise = metadataManager.createRecord(payload);

      await expect(createPromise).rejects.toThrow(QueryFailedError);
    });

    it('rejects if record already exists', async () => {
      const metadata = createFakeMetadataRecord();
      const payload = getPayload(metadata);
      findOne.mockResolvedValue(metadata);

      const createPromise = metadataManager.createRecord(payload);

      await expect(createPromise).rejects.toThrow(IdAlreadyExistsError);
    });
  });

  describe('#updateRecord', () => {
    const findOne = jest.fn();
    const save = jest.fn();
    beforeEach(() => {
      const repository = ({ findOne, save } as unknown) as Repository<Metadata>;
      metadataManager = new MetadataManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('resolves without errors if id is not in use', async () => {
      const metadata = createFakeMetadataRecord();
      const payload = getPayload(metadata);
      findOne.mockResolvedValue(metadata);
      save.mockResolvedValue(metadata);

      const updatePromise = metadataManager.updateRecord(metadata.identifier, payload);

      await expect(updatePromise).resolves.toStrictEqual(metadata);
    });

    it('rejects on DB error', async () => {
      const metadata = createFakeMetadataRecord();
      const payload = getPayload(metadata);
      findOne.mockRejectedValue(new QueryFailedError('select *', [], new Error()));

      const updatePromise = metadataManager.updateRecord(metadata.identifier, payload);

      await expect(updatePromise).rejects.toThrow(QueryFailedError);
    });

    it('rejects if record does not exists', async () => {
      const metadata = createFakeMetadataRecord();
      const payload = getPayload(metadata);
      findOne.mockResolvedValue(undefined);

      const updatePromise = metadataManager.updateRecord(metadata.identifier, payload);

      await expect(updatePromise).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('#deleteRecord', () => {
    const del = jest.fn();
    beforeEach(() => {
      const repository = ({ delete: del } as unknown) as Repository<Metadata>;
      metadataManager = new MetadataManager(repository, { log: jest.fn() });
    });
    afterEach(() => {
      del.mockClear();
    });

    it('resolves without errors if record exists or not', async () => {
      const metadata = createFakeMetadataRecord();

      await metadataManager.deleteRecord(metadata.identifier);

      expect(del).toHaveBeenCalled();
    });

    it('rejects on DB error', async () => {
      del.mockRejectedValue(new QueryFailedError('select *', [], new Error()));
      const metadata = createFakeMetadataRecord();

      const deletePromise = metadataManager.deleteRecord(metadata.identifier);

      await expect(deletePromise).rejects.toThrow(QueryFailedError);
    });
  });
});
