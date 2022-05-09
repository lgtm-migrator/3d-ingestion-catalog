import { IMetadataPayload } from '../models/metadata';
import { BadValues } from './errors';

export function checkValidationValues(metadata: IMetadataPayload): void {
  const startDate = new Date(metadata.sourceDateStart);
  const endDate = new Date(metadata.sourceDateEnd);
  if (startDate > endDate) {
    throw new BadValues('sourceStartDate should not be later than sourceEndDate');
  }

  if (metadata.minResolutionMeter != undefined && metadata.maxResolutionMeter != undefined) {
    if (metadata.minResolutionMeter > metadata.maxResolutionMeter) {
      throw new BadValues('minResolutionMeter should not be bigger than maxResolutionMeter');
    }
  }
}
