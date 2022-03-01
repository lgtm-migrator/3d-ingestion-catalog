/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ILink, IMetadataPayload } from '../../metadata/models/metadata';

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

export const formatStrings = (payload: IMetadataPayload) : IMetadataPayload => {
  const keyValuePairs = Object.entries(payload)
  const entries: [string, unknown][] = keyValuePairs.map(([k,v]) => {
    if(v && typeof(v)==='string' &&v.includes("'")){
      return [k, v.replace("'","`")]
    }
    return [k,v];
  });

  return Object.fromEntries(entries) as unknown as IMetadataPayload
};
