/* eslint-disable @typescript-eslint/no-magic-numbers */
import faker from 'faker';
import { IMetadataEntity, IUpdatePayload, IMetadataPayload } from '../../src/metadata/models/metadata';

const WKB_GEOMETRY = {
  type: 'Polygon',
  coordinates: [
    [
      [-125, 38.4],
      [-125, 40.9],
      [-121.8, 40.9],
      [-121.8, 38.4],
      [-125, 38.4],
    ],
  ],
};

interface IntegrationMetadata extends Omit<IMetadataEntity, 'insertDate' | 'creationDate' | 'sourceStartDate' | 'sourceEndDate' | 'wkbGeometry'> {
  insertDate: string;
  creationDate: string;
  sourceStartDate: string;
  sourceEndDate: string;
  wkbGeometry: Record<string, unknown>;
}

export const createFakeMetadataRecord = (): IMetadataEntity => {
  const record: IMetadataEntity = {
    id: faker.random.uuid(),
    typeName: 'undefined',
    schema: 'undefined',
    mdSource: 'undefined',
    xml: 'undefined',
    keywords: '3d',
    boundingBox: 'POLYGON((-125 38.4,-125 40.9,-121.8 40.9,-121.8 38.4,-125 38.4))',
    maxAccuracyCE90: faker.random.number(),
    minAccuracyCE90: faker.random.number(),
    productType: faker.random.word(),
    productionSystem: faker.random.word(),
    productionSystemVer: faker.random.word(),
    insertDate: faker.date.past(),
    creationDate: faker.date.past().toISOString(),
    producerName: 'Meow',
    description: faker.random.word(),
    type: 'RECORD_3D',
    classification: faker.random.word(),
    srsId: faker.random.number(),
    srsName: faker.random.word(),
    srsOrigin: faker.random.word(),
    productName: faker.random.word(),
    productVersion: faker.random.word(),
    footprint: faker.random.word(),
    sourceStartDate: faker.date.past().toISOString(),
    sourceEndDate: faker.date.past().toISOString(),
    sensorType: faker.random.word(),
    region: faker.random.word(),
    nominalResolution: faker.random.word(),
    accuracyLE90: faker.random.number(),
    relativeAccuracyLE90: faker.random.number(),
    anytext: 'test',
    anytextTsvector: 'test:1',
    links: [
      { url: faker.random.word(), protocol: faker.random.word() },
      { url: faker.random.word(), protocol: faker.random.word() },
    ],
  };
  return record;
};

export const getPayload = (metadata: IMetadataEntity): IMetadataPayload => {
  const payload = {
    ...metadata,
  };
  delete payload.anytextTsvector;
  delete payload.wkbGeometry;
  return payload;
};

export const getUpdatePayload = (): IUpdatePayload => {
  const payload = {
    title: faker.random.word(),
    description: faker.random.word(),
    classification: faker.random.word(),
    sensorType: faker.random.word(),
  };
  return payload;
};

export const convertObjectToResponse = (metadata: IMetadataEntity): IntegrationMetadata => {
  const { insertDate, creationDate, sourceStartDate, sourceEndDate, ...rest } = metadata;
  return {
    ...rest,
    insertDate: insertDate.toISOString(),
    creationDate: creationDate ?? '',
    sourceStartDate: sourceStartDate ?? '',
    sourceEndDate: sourceEndDate ?? '',
    anytextTsvector: 'test:1',
    wkbGeometry: WKB_GEOMETRY,
  };
};
