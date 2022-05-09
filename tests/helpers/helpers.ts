/* eslint-disable @typescript-eslint/no-magic-numbers */
import RandExp from 'randexp';
import faker from 'faker';
import wkt from 'terraformer-wkt-parser';
import { Geometry } from 'geojson';
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

const srsOriginHelper = new RandExp('^\\(([-]?(0|[1-9]\\d*)(\\.\\d+)?;){2}[-]?(0|[1-9]\\d*)(\\.\\d+)?\\)$').gen();
const classificationHelper = new RandExp('^[0-9]$').gen();
const productBoundingBoxHelper = new RandExp('^([-+]?(0|[1-9]\\d*)(\\.\\d+)?,){3}[-+]?(0|[1-9]\\d*)(\\.\\d+)?$').gen();
const listOfRandomWords = ['avi', 'אבי', 'lalalalala', 'וןםפ'];
const minResolutionMeter = faker.random.number(8000);
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
} as Geometry;

export const createFakeMetadataRecord = (): IMetadataPayload => {
  const record: IMetadataPayload = {
    productName: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    productType: '3DPhotoRealistic',
    description: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    creationDate: faker.date.past().toISOString(),
    sourceDateStart: faker.date.past().toISOString(),
    sourceDateEnd: faker.date.future().toISOString(),
    minResolutionMeter: minResolutionMeter,
    maxResolutionMeter: faker.random.number({ min: minResolutionMeter, max: 8000 }),
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
    links: [
      { url: faker.random.word(), protocol: faker.random.word() },
      { url: faker.random.word(), protocol: faker.random.word() },
    ],
  };
  return record;
};

export const createFakeMetadataEntity = (): IMetadataEntity => {
  const payload: IMetadataPayload = {
    ...createFakeMetadataRecord(),
  };
  const record: IMetadataEntity = {
    ...payload,
    productVersion: 1,
    productBoundingBox: productBoundingBoxHelper,
    boundingBox: wkt.convert(WKB_GEOMETRY as Geometry),

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
  };
  return record;
};

export const getUpdatePayload = (): IUpdatePayload => {
  const payload = {
    productName: faker.random.word(),
    description: faker.random.word(),
    classification: classificationHelper,
    sensors: faker.random.word(),
  };
  return payload;
};
