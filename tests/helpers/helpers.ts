import RandExp from 'randexp';
import faker from 'faker';
import wkt from 'terraformer-wkt-parser';
import { IMetadataEntity, IUpdatePayload, IMetadataPayload } from '../../src/metadata/models/metadata';

const srsOriginHelper = new RandExp('^\\(([-]?(0|[1-9]\\d*)(\\.\\d+)?;){2}[-]?(0|[1-9]\\d*)(\\.\\d+)?\\)$').gen();
const classificationHelper = new RandExp('^[0-9]$').gen();
// const productBoundingBoxHelper = new RandExp('^([-+]?(0|[1-9]\\d*)(\\.\\d+)?,){3}[-+]?(0|[1-9]\\d*)(\\.\\d+)?$').gen();
const listOfRandomWords = ['avi', 'אבי', 'lalalalala', 'וןםפ'];

const minX = faker.random.number();
const minY = faker.random.number();
const maxX = faker.random.number({ min: minX });
const maxY = faker.random.number({ min: minY });
const WKB_GEOMETRY = {
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
};

const maxResolutionMeter = 8000;
const noDataAccuracy = 999;
const maxSE90 = 250;
const maxAccuracy = 100;

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
    productName: Math.floor(Math.random() * listOfRandomWords.length).toString() + '',
    // productVersion: 1,
    productType: '3DPhotoRealistic',
    description: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    creationDate: faker.date.past().toISOString(),
    sourceDateStart: faker.date.past().toISOString(),
    sourceDateEnd: faker.date.past().toISOString(),
    minResolutionMeter: faker.random.number(maxResolutionMeter),
    maxResolutionMeter: faker.random.number(maxResolutionMeter),
    nominalResolution: faker.random.number(),
    maxAccuracyCE90: faker.random.number(),
    absoluteAccuracyLEP90: faker.random.number(noDataAccuracy),
    accuracySE90: faker.random.number(maxSE90),
    relativeAccuracyLEP90: faker.random.number(maxAccuracy),
    visualAccuracy: faker.random.number(maxAccuracy),
    sensors: faker.random.word(),
    footprint: WKB_GEOMETRY as GeoJSON.Geometry,
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
    boundingBox: wkt.convert(WKB_GEOMETRY as GeoJSON.Geometry),
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
