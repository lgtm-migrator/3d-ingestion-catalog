import { Geometry } from 'geojson';

export interface IMetadataPayload {
  productName: string;
  productVersion: string;
  productType: string;
  description?: string;
  creationDate?: string;
  sourceStartDate?: string;
  sourceEndDate?: string;
  minResolutionMeter?: number;
  maxResolutionMeter?: number;
  minResolutionDeg?: number;
  maxResolutionDeg?: number;
  nominalResolution?: string;
  minAccuracyCE90: number;
  maxAccuracyCE90: number;
  accuracyLE90: number;
  accuracySE90?: number;
  relativeAccuracyLE90?: number;
  visualAccuracy?: number;
  sensorType: string;
  footprint?: string;
  heightRangeFrom?: number;
  heightRangeTo?: number;
  srsId: number;
  srsName: string;
  srsOrigin?: string; // TODO: create struct representing it as a point
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
  boundingBox: string;
}

export interface IMetadataExternal extends IMetadataPayload {
  // External - auto
  id: string;
  insertDate: Date;
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
  title?: string;
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
  sensorType?: string;
}
