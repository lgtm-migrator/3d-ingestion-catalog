import { Geometry } from 'geojson';

export interface IMetadataPayload {
  productId?: string;
  productName: string;
  productType: string;
  description?: string;
  creationDate?: string;
  sourceDateStart: string;
  sourceDateEnd: string;
  minResolutionMeter?: number;
  maxResolutionMeter?: number;
  nominalResolution?: number;
  maxAccuracyCE90: number;
  absoluteAccuracyLEP90: number;
  accuracySE90?: number;
  relativeAccuracyLEP90?: number;
  visualAccuracy?: number;
  sensors: string;
  footprint: GeoJSON.Geometry;
  heightRangeFrom?: number;
  heightRangeTo?: number;
  srsId?: number;
  srsName: string;
  srsOrigin?: string;
  region: string;
  classification: string;
  compartmentalization?: string;
  productionSystem: string;
  productionSystemVer: string;
  producerName: string;
  productionMethod?: string;
  minFlightAlt?: number;
  maxFlightAlt?: number;
  geographicArea?: string;
  links: ILink[];
}

export interface IMetadataExternal extends IMetadataPayload {
  // External - auto
  identifier: string;
  insertDate: Date;
  productVersion: number;
  productBoundingBox: string;
  boundingBox: string;
}

export interface IMetadataEntity extends IMetadataExternal {
  type: string;
  typeName: string;
  schema: string;
  mdSource: string;
  xml: string;
  anytext: string;
  keywords: string;
  recordUpdateDate?: Date;
  anytextTsvector?: string;
  wkbGeometry?: Geometry;
}

export interface ILink {
  name?: string;
  description?: string;
  protocol: string;
  url: string;
}

export interface IUpdatePayload {
  /**
   * Title
   */
  productName?: string;
  /**
   * Description
   */
  description?: string;
  /**
   * Product classification
   */
  classification?: string;
  /**
   * The sensor used as the source of the product
   */
  sensors?: string;
}
