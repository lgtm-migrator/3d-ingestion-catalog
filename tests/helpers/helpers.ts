import RandExp from 'randexp';
import faker from 'faker';
import { RecordType, ProductType } from '@map-colonies/mc-model-types';
import { Metadata } from '../../src/metadata/models/generated';
import { IPayload, IUpdateMetadata, IUpdatePayload } from '../../src/common/dataModels/records';
import { linksToString } from '../../src/common/utils/format';

const srsOriginHelper = new RandExp('^\\(([-]?(0|[1-9]\\d*)(\\.\\d+)?;){2}[-]?(0|[1-9]\\d*)(\\.\\d+)?\\)$').gen();
const classificationHelper = new RandExp('^[0-9]$').gen();
const productBoundingBoxHelper = new RandExp('^([-+]?(0|[1-9]\\d*)(\\.\\d+)?,){3}[-+]?(0|[1-9]\\d*)(\\.\\d+)?$').gen();
const listOfRandomWords = ['avi', 'אבי', 'lalalalala', 'וןםפ'];
const years = 4;

const minX = faker.datatype.number();
const minY = faker.datatype.number();
const maxX = faker.datatype.number({ min: minX });
const maxY = faker.datatype.number({ min: minY });
const WKT_GEOMETRY = {
  coordinates: [
    [
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY],
    ],
  ],
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
  const sourceDateEnd = faker.date.past();
  const sourceDateStart = faker.date.past(years, sourceDateEnd);
  const minResolutionMeter = faker.datatype.number(maxResolutionMeter);
  const record: IPayload = {
    productId: undefined,
    type: RecordType.RECORD_3D,
    productName: Math.floor(Math.random() * listOfRandomWords.length).toString() + '',
    productType: ProductType.PHOTO_REALISTIC_3D,
    description: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    creationDate: faker.date.past(),
    sourceDateStart: sourceDateStart,
    sourceDateEnd: sourceDateEnd,
    minResolutionMeter: minResolutionMeter,
    maxResolutionMeter: faker.datatype.number({ min: minResolutionMeter, max: maxResolutionMeter }),
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
    links: linksPattern,
  };
  return record;
};

export const createFakeUpdatePayload = (): IUpdatePayload => {
  const payload: IUpdatePayload = {
    productName: faker.random.word(),
    accuracySE90: faker.datatype.number(maxSE90),
    creationDate: faker.date.past(),
    description: faker.random.word(),
    classification: classificationHelper,
    region: [faker.random.word()],
    relativeAccuracyLEP90: faker.datatype.number(maxAccuracy),
    visualAccuracy: faker.datatype.number(maxAccuracy),
    heightRangeFrom: faker.datatype.number(),
    heightRangeTo: faker.datatype.number(),
    productionMethod: faker.random.word(),
    geographicArea: faker.random.word(),
  };
  return payload;
};

export const createFakeUpdateMetadata = (): IUpdateMetadata => {
  const metadata: IUpdateMetadata = {
    productName: faker.random.word(),
    accuracySE90: faker.datatype.number(maxSE90),
    creationDate: faker.date.past(),
    description: faker.random.word(),
    classification: classificationHelper,
    region: faker.random.word(),
    relativeAccuracyLEP90: faker.datatype.number(maxAccuracy),
    visualAccuracy: faker.datatype.number(maxAccuracy),
    heightRangeFrom: faker.datatype.number(),
    heightRangeTo: faker.datatype.number(),
    productionMethod: faker.random.word(),
    geographicArea: faker.random.word(),
    updateDate: new Date(Date.now()),
    id: faker.datatype.uuid(),
  };
  return metadata;
};

export const createFakeEntity = (): Metadata => {
  const sourceDateEnd = faker.date.past();
  const sourceDateStart = faker.date.past(years, sourceDateEnd);
  const minResolutionMeter = faker.datatype.number(maxResolutionMeter);
  const id = faker.datatype.uuid();
  const metadata: Metadata = {
    type: RecordType.RECORD_3D,
    productName: Math.floor(Math.random() * listOfRandomWords.length).toString() + '',
    productType: ProductType.PHOTO_REALISTIC_3D,
    description: Math.floor(Math.random() * listOfRandomWords.length).toString(),
    creationDate: faker.date.past(),
    sourceDateStart: sourceDateStart,
    sourceDateEnd: sourceDateEnd,
    minResolutionMeter: minResolutionMeter,
    maxResolutionMeter: faker.datatype.number({ min: minResolutionMeter, max: maxResolutionMeter }),
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
