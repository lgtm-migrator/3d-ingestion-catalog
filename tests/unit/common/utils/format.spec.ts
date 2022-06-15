import { Link } from '@map-colonies/mc-model-types';
import { deserializeLinks, formatLinks } from '../../../../src/common/utils/format';

describe('format tests', () => {
  describe('formatLinks tests', () => {
    it("Shound return empty string when recieving 'undefined' as parameter", () => {
      const links = undefined;
      expect(formatLinks(links)).toBe('');
    });
    it('Should return correct serialized links string when given single Link', () => {
      const links: Link[] = [{ name: 'testName', description: 'testDescription', protocol: 'testProtocol', url: 'http://testURL.com' }];
      const expectedResult = 'testName,testDescription,testProtocol,http://testURL.com';
      expect(formatLinks(links)).toBe(expectedResult);
    });
    it('Should return correct serialized links string when given multiple Links', () => {
      const links: Link[] = [
        { name: 'testName1', description: 'testDescription1', protocol: 'testProtocol1', url: 'http://testURL1.com' },
        { name: 'testName2', description: 'testDescription2', protocol: 'testProtocol2', url: 'http://testURL2.com' },
      ];
      const expectedResult =
        'testName1,testDescription1,testProtocol1,http://testURL1.com^testName2,testDescription2,testProtocol2,http://testURL2.com';
      expect(formatLinks(links)).toBe(expectedResult);
    });
  });
  describe('deserializeLinks tests', () => {
    it("Shound return empty list when recieving an empty string or 'undefined' as parameter", () => {
      const linksStr = undefined;
      expect(deserializeLinks(linksStr)).toStrictEqual([]);
    });
    it('Should return correct serialized links string when given single Link', () => {
      const linksStr = 'testName,testDescription,testProtocol,http://testURL.com';
      const expectedResult: Link[] = [{ name: 'testName', description: 'testDescription', protocol: 'testProtocol', url: 'http://testURL.com' }];
      expect(deserializeLinks(linksStr)).toStrictEqual(expectedResult);
    });
    it('Should return correct serialized links string when given multiple Links', () => {
      const linksStr = 'testName1,testDescription1,testProtocol1,http://testURL1.com^testName2,testDescription2,testProtocol2,http://testURL2.com';
      const expectedResult: Link[] = [
        { name: 'testName1', description: 'testDescription1', protocol: 'testProtocol1', url: 'http://testURL1.com' },
        { name: 'testName2', description: 'testDescription2', protocol: 'testProtocol2', url: 'http://testURL2.com' },
      ];
      expect(deserializeLinks(linksStr)).toStrictEqual(expectedResult);
    });
  });
});
