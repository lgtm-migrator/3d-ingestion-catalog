import { I3DCatalogUpsertRequestBody } from '@map-colonies/mc-model-types';

type IUpdatePayloadWithoutRegion = Omit<IUpdatePayload, 'region'>;
export interface MetadataParams {
  identifier: string;
}

export type IPayload = Omit<I3DCatalogUpsertRequestBody, 'productVersion' | 'productBoundingBox' | 'updateDate'>;

export interface IUpdatePayload {
  productName: string;
  description?: string;
  creationDate: Date;
  accuracySE90: number;
  relativeAccuracyLEP90: number;
  visualAccuracy: number;
  heightRangeFrom: number;
  heightRangeTo: number;
  region: string[];
  classification: string;
  productionMethod: string;
  geographicArea: string;
}


export interface IUpdateMetadata extends IUpdatePayloadWithoutRegion {
  id: string;
  region: string;
  updateDate: Date;
}