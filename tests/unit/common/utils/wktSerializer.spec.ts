import { Geometry } from 'geojson';
import { wktToGeojson } from '../../../../src/common/utils/wktSerializer';

describe('wktSerializer tests', () => {
  describe('wktToGeojson tests', () => {
    it('Should return valid geojson when provided valid WKT', () => {
      const wkt = 'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))';
      const result: Geometry = wktToGeojson(wkt);
      const expected: Geometry = {
        coordinates: [
          [
            [30, 10],
            [10, 20],
            [20, 40],
            [40, 40],
            [30, 10],
          ],
        ],
        type: 'Polygon',
      };
      expect(result).toStrictEqual(expected);
    });
  });
});