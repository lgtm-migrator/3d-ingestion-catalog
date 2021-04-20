import { IPayload } from '../../metadata/models/metadata';

export const formatLinks = (payload: IPayload): string => {
  if (payload.links == undefined) {
    return '';
  }
  return payload.links
    .map((link) => `${link.name == undefined ? '' : link.name},${link.description == undefined ? '' : link.description},${link.protocol},${link.url}`)
    .join('^');
};
