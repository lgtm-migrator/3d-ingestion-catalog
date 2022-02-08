/* eslint-disable @typescript-eslint/no-magic-numbers */
import RandExp from 'randexp';
import faker from 'faker';
import { IMetadataEntity, IUpdatePayload, IMetadataPayload } from '../../src/metadata/models/metadata';
// import { getRecord } from '../integration/metadata/controllers/helpers/requestSender';

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

const srsOriginHelper = new RandExp('^\\(([-]?(0|[1-9]\\d*)(\\.\\d+)?;){2}[-]?(0|[1-9]\\d*)(\\.\\d+)?\\)$').gen();
const classificationHelper = new RandExp('^[0-9]$').gen();
const productBoundingBoxHelper = new RandExp('^([-+]?(0|[1-9]\\d*)(\\.\\d+)?,){3}[-+]?(0|[1-9]\\d*)(\\.\\d+)?$').gen();
const listOfRandomWords = ['avi', 'אבי', 'lalalalala', 'וןםפ'];
const minX = 1;
const minY = 2;
const maxX = 3;
const maxY = 4;
const exampleGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY],
    ],
  ],
} as GeoJSON.Geometry;

interface IntegrationMetadata extends Omit<IMetadataEntity, 'insertDate' | 'creationDate' | 'sourceDateStart' | 'sourceDateEnd' | 'wkbGeometry'> {
  insertDate: string;
  creationDate: string;
  sourceDateStart: string;
  sourceDateEnd: string;
  wkbGeometry: Record<string, unknown>;
}

export const createFakeMetadataRecord = (): IMetadataEntity => {
  const record: IMetadataEntity = {
    identifier: faker.random.uuid(),
    insertDate: faker.date.past(),

    type: 'RECORD_3D',
    typeName: 'undefined',
    schema: 'undefined',
    mdSource: 'undefined',
    xml: 'undefined',
    anytext: 'test',
    keywords: '3d',
    anytextTsvector: 'test:1',

    // productId: faker.random.uuid(),
    productName: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    // productVersion: 1,
    productType: '3DPhotoRealistic',
    description: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    creationDate: faker.date.past().toISOString(),
    sourceDateStart: faker.date.past().toISOString(),
    sourceDateEnd: faker.date.past().toISOString(),
    minResolutionMeter: faker.random.number(8000),
    maxResolutionMeter: faker.random.number(8000),
    nominalResolution: faker.random.number(),
    maxAccuracyCE90: faker.random.number(),
    absoluteAccuracyLEP90: faker.random.number(999),
    accuracySE90: faker.random.number(250),
    relativeAccuracyLEP90: faker.random.number(100),
    visualAccuracy: faker.random.number(100),
    sensors: faker.random.word(),
    footprint: exampleGeometry,
    heightRangeFrom: faker.random.number(),
    heightRangeTo: faker.random.number(),
    srsId: faker.random.number(),
    srsName: faker.random.word(),
    srsOrigin: srsOriginHelper,
    region: faker.random.word(),
    classification: classificationHelper,
    compartmentalization: faker.random.word(),
    productionSystem: faker.random.word(),
    productionSystemVer: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    producerName: faker.random.word(),
    productionMethod: faker.random.word(),
    minFlightAlt: faker.random.number(),
    maxFlightAlt: faker.random.number(),
    geographicArea: faker.random.word(),
    // productBoundingBox: productBoundingBoxHelper,
    links: [
      { url: faker.random.word(), protocol: faker.random.word() },
      { url: faker.random.word(), protocol: faker.random.word() },
    ],
    boundingBox: 'POLYGON((-125 38.4,-125 40.9,-121.8 40.9,-121.8 38.4,-125 38.4))',
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
  const { insertDate, creationDate, sourceDateStart, sourceDateEnd, ...rest } = metadata;
  return {
    ...rest,
    insertDate: insertDate.toISOString(),
    creationDate: creationDate ?? '',
    sourceDateStart: sourceDateStart,
    sourceDateEnd: sourceDateEnd,
    anytextTsvector: 'test:1',
    wkbGeometry: WKB_GEOMETRY,
  };
};
