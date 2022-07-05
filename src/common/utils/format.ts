import { Link } from '@map-colonies/mc-model-types';

export const linksToString = (links: Link[]): string => {
  const stringLinks = links.map((link) => `${link.name ?? ''},${link.description ?? ''},${link.protocol ?? ''},${link.url ?? ''}`);
  return stringLinks.join('^');
};

export const formatStrings = <T>(payload: T): T => {
  const keyValuePairs = Object.entries(payload);
  const entries: [string, unknown][] = keyValuePairs.map(([k, v]) => {
    if (v != undefined && typeof v === 'string' && v.includes("'")) {
      return [k, v.replace("'", '`')];
    }
    return [k, v];
  });
  return Object.fromEntries(entries) as unknown as T;
};
