
import { IPayload, IUpdateMetadata, IUpdatePayload, MetadataParams } from '../../common/dataModels/records';
import { BadValues } from './errors';

export function checkValidationValues(payload: IPayload): void {
    
  const startDate = new Date(payload.sourceDateStart ?payload.sourceDateStart:0 );
  const endDate = new Date(payload.sourceDateEnd);
  if (startDate > endDate) {
    throw new BadValues('sourceStartDate should not be later than sourceEndDate');
  }

  if (metadata.minResolutionMeter != undefined && metadata.maxResolutionMeter != undefined) {
    if (metadata.minResolutionMeter > metadata.maxResolutionMeter) {
      throw new BadValues('minResolutionMeter should not be bigger than maxResolutionMeter');
    }
  }
}