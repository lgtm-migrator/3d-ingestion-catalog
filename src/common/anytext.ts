import { IPayload } from './dataModels/records';

export function getAnyTextValue(payload: IPayload): string {
  const filteredKeys = ['creationDate', 'sourceDateStart', 'sourceDateEnd', 'footprint', 'links'];
  return Object.entries(payload)
    .filter(([key, value]) => !filteredKeys.includes(key) && value !== undefined && typeof value === 'string')
    .map(([, value]) => value as string)
    .join(' ');
}