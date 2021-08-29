import { ILink } from '../../metadata/models/metadata';

export const formatLinks = (links: ILink[] | undefined): string => {
  if (links == undefined) {
    return '';
  }
  return links.map((link) => `${link.name ?? ''},${link.description ?? ''},${link.protocol},${link.url}`).join('^');
};

export const deserializeLinks = (linksStr: string | undefined): ILink[] => {
  if (linksStr == undefined) {
    return [];
  }

  return linksStr.split('^').map((linkStr) => {
    const [name, description, protocol, url] = linkStr.split(',');
    return { name, description, protocol, url };
  });
};
