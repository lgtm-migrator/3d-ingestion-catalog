import { I3DCatalogUpsertRequestBody } from '@map-colonies/mc-model-types';

export function getAnyTextValue(payload: I3DCatalogUpsertRequestBody): string {
  const filteredKeys = ['creationDate', 'sourceDateStart', 'sourceDateEnd', 'footprint', 'links'];
  return Object.entries(payload)
    .filter(([key, value]) => !filteredKeys.includes(key) && value !== undefined && typeof value === 'string')
    .map(([, value]) => value as string)
    .join(' ');
}
