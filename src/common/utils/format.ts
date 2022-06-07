/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { I3DCatalogUpsertRequestBody, Link } from '@map-colonies/mc-model-types';

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

export const linksToString = (links: Link[]): string => {
  const stringLinks = links.map((link) => `${link.name ?? ''}, ${link.description ?? ''}, ${link.protocol ?? ''}, ${link.url ?? ''}`);
  return stringLinks.join('^');
};

export const formatStrings = (payload: I3DCatalogUpsertRequestBody): I3DCatalogUpsertRequestBody => {
  const keyValuePairs = Object.entries(payload);
  const entries: [string, unknown][] = keyValuePairs.map(([k, v]) => {
    if (v && typeof v === 'string' && v.includes("'")) {
      return [k, v.replace("'", '`')];
    }
    return [k, v];
  });
  return Object.fromEntries(entries) as unknown as I3DCatalogUpsertRequestBody;
};
