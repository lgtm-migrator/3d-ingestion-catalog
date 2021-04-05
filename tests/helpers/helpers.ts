import faker from 'faker';
import { IMetadata, Metadata } from '../../src/metadata/models/metadata';

const LAT = 20.0924758;
const LON = 72.7341809;

interface IntegrationMetadata extends Omit<Metadata, 'insertDate' | 'creationDate' | 'validationDate' | 'timeBegin' | 'timeEnd' | 'wkbGeometry'> {
  insertDate: string;
  creationDate: string;
  validationDate: string;
  timeBegin: string;
  timeEnd: string;
  wkbGeometry: Record<string, unknown>;
}

export const createFakeMetadataRecord = (): IMetadata => {
  return {
    identifier: faker.random.uuid(),
    typeName: faker.random.word(),
    schema: faker.random.word(),
    mdSource: faker.random.word(),
    xml: faker.random.word(),
    anytext: 'test',
    insertDate: faker.date.past(),
    creationDate: faker.date.past(),
    validationDate: faker.date.past(),
    wktGeometry: `POINT(${LAT} ${LON})`,
    title: faker.random.word(),
    producerName: 'IDFMU',
    description: faker.random.word(),
    type: faker.random.word(),
    classification: faker.random.word(),
    srs: faker.random.word(),
    projectName: faker.random.word(),
    version: faker.random.word(),
    centroid: faker.random.word(),
    footprint: faker.random.word(),
    timeBegin: faker.date.past(),
    timeEnd: faker.date.past(),
    sensorType: faker.random.word(),
    region: faker.random.word(),
    nominalResolution: faker.random.word(),
    accuracyLE90: faker.random.word(),
    horizontalAccuracyCE90: faker.random.word(),
    relativeAccuracyLE90: faker.random.word(),
    estimatedPrecision: faker.random.word(),
    measuredPrecision: faker.random.word(),
    links: faker.random.word(),
    anytextTsvector: "'test':1",
  };
};

export const convertObjectToResponse = (metadata: IMetadata): IntegrationMetadata => {
  const { insertDate, creationDate, validationDate, timeBegin, timeEnd, ...rest } = metadata;
  return {
    ...rest,
    insertDate: insertDate.toISOString(),
    creationDate: creationDate ? creationDate.toISOString() : '',
    validationDate: validationDate ? validationDate.toISOString() : '',
    timeBegin: timeBegin ? timeBegin.toISOString() : '',
    timeEnd: timeEnd ? timeEnd.toISOString() : '',
    wkbGeometry: { coordinates: [LAT, LON], type: 'Point' },
  };
};
