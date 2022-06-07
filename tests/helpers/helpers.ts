import RandExp from 'randexp';
import faker from 'faker';
import { RecordType, ProductType } from '@map-colonies/mc-model-types';
import { Metadata } from '../../src/metadata/models/generated';
import { IPayload, IUpdatePayload } from '../../src/common/dataModels/records';
import { linksToString } from '../../src/common/utils/format';

const srsOriginHelper = new RandExp('^\\(([-]?(0|[1-9]\\d*)(\\.\\d+)?;){2}[-]?(0|[1-9]\\d*)(\\.\\d+)?\\)$').gen();
const classificationHelper = new RandExp('^[0-9]$').gen();
const productBoundingBoxHelper = new RandExp('^([-+]?(0|[1-9]\\d*)(\\.\\d+)?,){3}[-+]?(0|[1-9]\\d*)(\\.\\d+)?$').gen();
const listOfRandomWords = ['avi', 'אבי', 'lalalalala', 'וןםפ'];

const minX = faker.datatype.number();
const minY = faker.datatype.number();
const maxX = faker.datatype.number({ min: minX });
const maxY = faker.datatype.number({ min: minY });
const WKT_GEOMETRY = {
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
    links: [
      { url: faker.random.word(), protocol: faker.random.word() },
      { url: faker.random.word(), protocol: faker.random.word() },
    ],
  };
  return record;
};

export const getUpdatePayload = (): IUpdatePayload => {
  const payload: IUpdatePayload = {
    productName: faker.random.word(),
    description: faker.random.word(),
    classification: faker.random.word(),
    sensors: faker.random.word(),
  };
  return payload;
};

export const createFakeEntity = (): Metadata => {
  const id = faker.datatype.uuid();
  const links = [
    { url: faker.random.word(), protocol: faker.random.word() },
    { url: faker.random.word(), protocol: faker.random.word() },
  ];
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
    anyText: 'test',
    keywords: 'test',
    updateDate: faker.date.past(),
    sensors: [faker.random.word()].join(', '),
    region: [faker.random.word()].join(', '),
    links: linksToString(links),
  };
  return metadata;
};
