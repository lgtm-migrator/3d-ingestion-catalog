/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Layer3DMetadata, Link, Pycsw3DCatalogRecord } from '@map-colonies/mc-model-types';
// import { ILink, IMetadataPayload } from '../../metadata/models/metadata';

export const formatLinks = (links: Link[] | undefined): string => {
  if (links == undefined) {
    return '';
  }
  return links.map((link) => `${link.name ?? ''},${link.description ?? ''},${link.protocol ?? ''},${link.url ?? ''}`).join('^');
};

export const deserializeLinks = (linksStr: string | undefined): Link[] => {
  if (linksStr == undefined) {
    return [];
  }

  return linksStr.split('^').map((linkStr) => {
    const [name, description, protocol, url] = linkStr.split(',');
    return { name, description, protocol, url };
  });
};

// export const formatStrings = (payload: Layer3DMetadata): Layer3DMetadata => {
//   const keyValuePairs = Object.entries(payload);
//   const entries: [string, unknown][] = keyValuePairs.map(([k, v]) => {
//     if (v && typeof v === 'string' && v.includes("'")) {
//       return [k, v.replace("'", '`')];
//     }
//     return [k, v];
//   });

//   return (Object.fromEntries(entries) as unknown) as Layer3DMetadata;
// };
