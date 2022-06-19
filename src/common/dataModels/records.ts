import { I3DCatalogUpsertRequestBody } from '@map-colonies/mc-model-types';
import { Metadata } from '../../metadata/models/generated';

export interface MetadataParams {
  identifier: string;
}

export type IPayload = Omit<I3DCatalogUpsertRequestBody, 'productVersion' | 'productBoundingBox' | 'updateDate'>;

export interface IUpdatePayload extends Partial<Metadata> {
  productName: string;
  description?: string;
  creationDate: Date;
  accuracySE90: number;
  relativeAccuracyLEP90: number;
  visualAccuracy: number;
  heightRangeFrom: number;
  heightRangeTo: number;
  region: string;
  classification: string;
  productionMethod: string;
  geographicArea: string;
}

export interface IUpdateMetadata extends IUpdatePayload {
  anytext: string;
}
