/* eslint-disable @typescript-eslint/naming-convention */
import faker, { fake } from 'faker';
import { IMetadata, Metadata } from '../../src/metadata/models/metadata';

interface IntegrationMetadata extends Omit<Metadata, 'insertDate' | 'creationDate' | 'validationDate' | 'timeBegin' | 'timeEnd'> {
  insertDate: string;
  creationDate: string;
  validationDate: string;
  timeBegin: string;
  timeEnd: string;
}

export const createFakeMetadata = (): IMetadata => {
  return {
    identifier: faker.random.uuid(),
    typeName: faker.random.word(),
    schema: faker.random.word(),
    mdSource: faker.random.word(),
    xml: faker.random.word(),
    anytext: faker.random.word(),
    wktGeometry: faker.random.word(),
    title: faker.random.word(),
    producerName: faker.random.word(),
    description: faker.random.word(),
    insertDate: faker.date.past(),
    creationDate: faker.date.past(),
    validationDate: faker.date.past(),
    type: faker.random.word(),
    classification: faker.random.word(),
    srs: faker.random.word(),
    projectName: faker.random.word(),
    version: faker.random.word(),
    centroid: faker.random.word(),
    footprint: faker.random.word(),
    timeBegin: faker.date.past(),
    timeEnd: faker.date.past(),
    sensorType: [faker.random.word()],
    region: faker.random.word(),
    nominalResolution: faker.random.word(),
    accuracyLE90: faker.random.word(),
    horizontalAccuracyCE90: faker.random.word(),
    relativeAccuracyLE90: faker.random.word(),
    estimatedPrecision: faker.random.word(),
    measuredPrecision: faker.random.word(),
    links: faker.random.word(),
    anytextTsvector: faker.random.word(),
    wkbGeometry: faker.random.word(),
  };
};

export const convertTimestampToISOString = (metadata: IMetadata): IntegrationMetadata => {
  const { insertDate, creationDate, validationDate, timeBegin, timeEnd, ...rest } = metadata;
  return {
    ...rest,
    insertDate: insertDate ? insertDate.toISOString() : '',
    creationDate: creationDate ? creationDate.toISOString() : '',
    validationDate: validationDate ? validationDate.toISOString() : '',
    timeBegin: timeBegin ? timeBegin.toISOString() : '',
    timeEnd: timeEnd ? timeEnd.toISOString() : '',
  };
};
