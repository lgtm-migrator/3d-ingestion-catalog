import RandExp from 'randexp';
import faker from 'faker';
<<<<<<< HEAD
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
=======
import { RecordType, ProductType } from '@map-colonies/mc-model-types';
import { Metadata } from '../../src/metadata/models/generated';
import { IPayload, IUpdatePayload } from '../../src/common/dataModels/records';
import { linksToString } from '../../src/common/utils/format';
>>>>>>> origin/master

const srsOriginHelper = new RandExp('^\\(([-]?(0|[1-9]\\d*)(\\.\\d+)?;){2}[-]?(0|[1-9]\\d*)(\\.\\d+)?\\)$').gen();
const classificationHelper = new RandExp('^[0-9]$').gen();
const productBoundingBoxHelper = new RandExp('^([-+]?(0|[1-9]\\d*)(\\.\\d+)?,){3}[-+]?(0|[1-9]\\d*)(\\.\\d+)?$').gen();
const listOfRandomWords = ['avi', 'אבי', 'lalalalala', 'וןםפ'];
<<<<<<< HEAD
const minResolutionMeter = faker.random.number(8000);
const minX = 1;
const minY = 2;
const maxX = 3;
const maxY = 4;
const exampleGeometry = {
  type: 'Polygon',
=======

const minX = faker.datatype.number();
const minY = faker.datatype.number();
const maxX = faker.datatype.number({ min: minX });
const maxY = faker.datatype.number({ min: minY });
const WKT_GEOMETRY = {
>>>>>>> origin/master
  coordinates: [
    [
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY],
    ],
  ],
<<<<<<< HEAD
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
=======
  type: 'Polygon',
};

const maxResolutionMeter = 8000;
const noDataAccuracy = 999;
const maxSE90 = 250;
const maxAccuracy = 100;
const linksPattern = [
  {
    protocol: 'test',
    url: 'http://test.test/wmts',
  },
  {
    name: 'testLink',
    description: 'test test test',
    protocol: 'fulltest',
    url: 'http://test.test/wms',
  },
];

export const createFakePayload = (): IPayload => {
  const record: IPayload = {
    productId: undefined,
    type: RecordType.RECORD_3D,
    productName: Math.floor(Math.random() * listOfRandomWords.length).toString() + '',
    productType: ProductType.PHOTO_REALISTIC_3D,
    description: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    creationDate: faker.date.past(),
    sourceDateStart: faker.date.past(),
    sourceDateEnd: faker.date.past(),
    minResolutionMeter: faker.datatype.number(maxResolutionMeter),
    maxResolutionMeter: faker.datatype.number(maxResolutionMeter),
    nominalResolution: faker.datatype.number(),
    maxAccuracyCE90: faker.datatype.number(),
    absoluteAccuracyLEP90: faker.datatype.number(noDataAccuracy),
    accuracySE90: faker.datatype.number(maxSE90),
    relativeAccuracyLEP90: faker.datatype.number(maxAccuracy),
    visualAccuracy: faker.datatype.number(maxAccuracy),
    sensors: [faker.random.word()],
    footprint: WKT_GEOMETRY as GeoJSON.Geometry,
    heightRangeFrom: faker.datatype.number(),
    heightRangeTo: faker.datatype.number(),
    srsId: faker.random.word(),
>>>>>>> origin/master
    srsName: faker.random.word(),
    srsOrigin: srsOriginHelper,
    region: [faker.random.word()],
    classification: classificationHelper,
    productionSystem: faker.random.word(),
    productionSystemVer: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    producerName: faker.random.word(),
    productionMethod: faker.random.word(),
    minFlightAlt: faker.datatype.number(),
    maxFlightAlt: faker.datatype.number(),
    geographicArea: faker.random.word(),
<<<<<<< HEAD
    links: [
      { url: faker.random.word(), protocol: faker.random.word() },
      { url: faker.random.word(), protocol: faker.random.word() },
    ],
=======
    links: linksPattern,
>>>>>>> origin/master
  };
  return record;
};

<<<<<<< HEAD
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
=======
export const getUpdatePayload = (): IUpdatePayload => {
  const payload: IUpdatePayload = {
    productName: faker.random.word(),
    description: faker.random.word(),
    classification: faker.random.word(),
>>>>>>> origin/master
    sensors: faker.random.word(),
  };
  return payload;
};
<<<<<<< HEAD
=======

export const createFakeEntity = (): Metadata => {
  const id = faker.datatype.uuid();
  const metadata: Metadata = {
    type: RecordType.RECORD_3D,
    productName: Math.floor(Math.random() * listOfRandomWords.length).toString() + '',
    productType: ProductType.PHOTO_REALISTIC_3D,
    description: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    creationDate: faker.date.past(),
    sourceDateStart: faker.date.past(),
    sourceDateEnd: faker.date.past(),
    minResolutionMeter: faker.datatype.number(maxResolutionMeter),
    maxResolutionMeter: faker.datatype.number(maxResolutionMeter),
    nominalResolution: faker.datatype.number(),
    maxAccuracyCE90: faker.datatype.number(),
    absoluteAccuracyLEP90: faker.datatype.number(noDataAccuracy),
    accuracySE90: faker.datatype.number(maxSE90),
    relativeAccuracyLEP90: faker.datatype.number(maxAccuracy),
    visualAccuracy: faker.datatype.number(maxAccuracy),
    footprint: WKT_GEOMETRY as GeoJSON.Geometry,
    heightRangeFrom: faker.datatype.number(),
    heightRangeTo: faker.datatype.number(),
    srsId: faker.random.word(),
    srsName: faker.random.word(),
    srsOrigin: srsOriginHelper,
    classification: classificationHelper,
    productionSystem: faker.random.word(),
    productionSystemVer: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    producerName: faker.random.word(),
    productionMethod: faker.random.word(),
    minFlightAlt: faker.datatype.number(),
    maxFlightAlt: faker.datatype.number(),
    geographicArea: faker.random.word(),
    id: id,
    productVersion: 1,
    productId: id,
    insertDate: faker.date.past(),
    typeName: 'mc_MC3DRecord',
    mdSource: '',
    productBoundingBox: productBoundingBoxHelper,
    schema: 'md_3d',
    xml: '',
    anyText: 'testAnyText',
    keywords: 'testKeywords',
    updateDate: faker.date.past(),
    sensors: [faker.random.word()].join(', '),
    region: [faker.random.word()].join(', '),
    links: linksToString(linksPattern),
  };
  return metadata;
};
>>>>>>> origin/master
