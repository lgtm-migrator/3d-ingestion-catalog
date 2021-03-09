/* eslint-disable @typescript-eslint/naming-convention */
import faker from 'faker';
import { IMetadata, Metadata } from '../../src/metadata/models/metadata';

interface IntegrationMetadata extends Omit<Metadata, 'SourceDateStart' | 'SourceDateEnd'> {
  SourceDateStart: string;
  SourceDateEnd: string;
}

export const createRandom = (): string => {
  const LEN = 36;
  return faker.random.alphaNumeric(LEN);
};

export const createUuid = (): string => {
  return faker.random.uuid();
};

export const createDate = (): Date => {
  return faker.date.past();
};

export const createFakeMetadata = (): IMetadata => {
  return {
    productId: 'string',
    productName: 'string',
    geographicArea: 'string',
    productVersion: 1,
    productType: '3DModel',
    description: 'string',
    classification: 'string',
    footprint: 'string',
    extentLowerLeft: 'string',
    extentUpperRight: 'string',
    SourceDateStart: createDate(),
    SourceDateEnd: createDate(),
    producerName: 'IDFMU',
    SRS: 'string',
    SRSOrigin: 'string',
    nominalResolution: 'string',
    accuracyLE90: 'string',
    horizontalAccuracyCE90: 'string',
    relativeAccuracyLE90: 'string',
    heightRangeFrom: 0,
    heightRangeTo: 0,
    sensor: ['string'],
    productionMethod: 'Photogrammetric',
    productionSystem: 'string',
  };
};

export const createFakeIntegrationMetadata = (): IntegrationMetadata => {
  const metadata = createFakeMetadata();
  return convertToISOTimestamp(metadata);
};

export const convertToISOTimestamp = (metadata: IMetadata): IntegrationMetadata => {
  const { SourceDateStart, SourceDateEnd, ...rest } = metadata;
  return { ...rest, SourceDateStart: SourceDateStart.toISOString(), SourceDateEnd: SourceDateEnd.toISOString() };
};
