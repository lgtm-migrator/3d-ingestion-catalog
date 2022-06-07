import { I3DCatalogUpsertRequestBody } from '@map-colonies/mc-model-types';
import { Metadata } from '../../metadata/models/generated';

export interface MetadataParams {
  identifier: string;
}

export type IPayload = Omit<I3DCatalogUpsertRequestBody, 'productVersion' | 'productBoundingBox' | 'updateDate'>;

export interface IUpdatePayload extends Partial<Metadata> {
  /**
   * Title
   */
  productName: string;
  /**
   * Description
   */
  description?: string;
  /**
   * Product classification
   */
  classification: string;
  /**
   * The sensor used as the source of the product
   */
  sensors: string;
}
