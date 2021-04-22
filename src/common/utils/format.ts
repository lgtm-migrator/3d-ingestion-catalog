import { ILink } from '../../metadata/models/metadata';

export const formatLinks = (links: ILink[] | undefined): string => {
  if (links == undefined) {
    return '';
  }
  return links.map((link) => `${link.name ?? ''},${link.description ?? ''},${link.protocol},${link.url}`).join('^');
};
