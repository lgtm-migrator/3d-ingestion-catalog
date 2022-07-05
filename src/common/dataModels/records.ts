import { I3DCatalogUpsertRequestBody } from '@map-colonies/mc-model-types';

export interface MetadataParams {
  identifier: string;
}

export type IPayload = Omit<I3DCatalogUpsertRequestBody, 'productVersion' | 'productBoundingBox' | 'updateDate'>;

export interface IUpdatePayload {
  description?: string;
  creationDate: Date;
  minResolutionMeter: number;
  maxResolutionMeter: number;
  maxAccuracyCE90: number;
  absoluteAccuracyLEP90: number;
  accuracySE90: number;
  relativeAccuracyLEP90: number;
  visualAccuracy: number;
  heightRangeFrom: number;
  heightRangeTo: number;
  producerName: string;
  minFlightAlt: number;
  maxFlightAlt: number;
  geographicArea: string;
}

export interface IUpdateMetadata extends IUpdatePayload {
  id: string;
  updateDate: Date;
}
