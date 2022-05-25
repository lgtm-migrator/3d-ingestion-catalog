import { Layer3DMetadata, Link, Pycsw3DCatalogRecord } from '@map-colonies/mc-model-types';
// import { IMetadataPayload } from '../metadata/models/metadata';

export function getAnyTextValue(payload: Layer3DMetadata): string {
  const filteredKeys = ['creationDate', 'sourceDateStart', 'sourceDateEnd', 'footprint', 'links'];
  return Object.entries(payload)
    .filter(([key, value]) => !filteredKeys.includes(key) && value !== undefined && typeof value === 'string')
    .map(([, value]) => value as string)
    .join(' ');
}
