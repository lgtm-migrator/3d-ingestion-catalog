import { I3DCatalogUpsertRequestBody, RecordStatus } from '@map-colonies/mc-model-types';

export interface MetadataParams {
  identifier: string;
}

export type IPayload = Omit<I3DCatalogUpsertRequestBody, 'productVersion' | 'productBoundingBox' | 'updateDate'>;

export interface IUpdate {
  productName?: string;
  description?: string;
  creationDate?: Date;
  minResolutionMeter?: number;
  maxResolutionMeter?: number;
  maxAccuracyCE90?: number;
  absoluteAccuracyLE90?: number;
  accuracySE90?: number;
  relativeAccuracySE90?: number;
  visualAccuracy?: number;
  heightRangeFrom?: number;
  heightRangeTo?: number;
  producerName?: string;
  minFlightAlt?: number;
  maxFlightAlt?: number;
  geographicArea?: string;
}

export interface IUpdatePayload extends IUpdate {
  sensors?: string[];
}

export interface IUpdateMetadata extends IUpdate {
  id: string;
  updateDate: Date;
  productStatus?: RecordStatus;
  sensors?: string;
}
