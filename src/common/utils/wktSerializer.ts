/* eslint-disable */
import { Geometry } from 'geojson';

import * as Wkt from 'wicket';

export const wktToGeojson = (wkt: string): Geometry => {
  const serializer = new Wkt.Wkt();
  serializer.read(wkt);
  return serializer.toJson();
};

export const geojsonToWkt = (wkt: string): Geometry => {
  const serializer = new Wkt.Wkt();
  return serializer.read(wkt);
};