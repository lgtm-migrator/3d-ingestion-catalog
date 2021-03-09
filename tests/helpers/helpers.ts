/* eslint-disable @typescript-eslint/naming-convention */
import faker from 'faker';
import { IMetadata, Metadata } from '../../src/metadata/models/metadata';

interface IntegrationMetadata extends Omit<Metadata, 'SourceDateStart' | 'SourceDateEnd'> {
  SourceDateStart: string;
  SourceDateEnd: string;
}

export const createFakeMetadata = (): IMetadata => {
  return {
    productId: faker.random.uuid(),
    productName: 'string',
    geographicArea: 'string',
    productVersion: 1,
    productType: '3DModel',
    description: 'string',
    classification: 'string',
    footprint: 'string',
    extentLowerLeft: 'string',
    extentUpperRight: 'string',
    SourceDateStart: faker.date.past(),
    SourceDateEnd: faker.date.past(),
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

export const convertTimestampToISOString = (metadata: IMetadata): IntegrationMetadata => {
  const { SourceDateStart, SourceDateEnd, ...rest } = metadata;
  return { ...rest, SourceDateStart: SourceDateStart.toISOString(), SourceDateEnd: SourceDateEnd.toISOString() };
};
