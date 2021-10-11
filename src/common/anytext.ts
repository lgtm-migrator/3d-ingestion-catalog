import { IMetadataPayload } from '../metadata/models/metadata';

export function getAnyTextValue(payload: IMetadataPayload): string {
  const filteredKeys = ['creationDate', 'sourceDateStart', 'sourceDateEnd', 'footprint', 'links', 'boundingBox'];
  return Object.entries(payload)
    .filter(([key, value]) => !filteredKeys.includes(key) && value !== undefined && typeof value === 'string')
    .map(([, value]) => value as string)
    .join(' ');
}
