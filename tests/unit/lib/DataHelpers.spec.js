import { flattenObject, alphaNumericSortDefault, regexSort } from '@/lib/DataHelpers'

describe('DataHelpers', () => {
  describe('flattenObject', () => {
    it('should flatten an object', () => {
      const testPersonObject = {
        name: 'Person1',
        job: { company: 'Company X', title: 'Test role' },
        location: { place: 'Place X', postcode: 'AB1 2A4' },
      }
      expect(flattenObject(testPersonObject)).toEqual({
        name: 'Person1',
        'job.company': 'Company X',
        'job.title': 'Test role',
        'location.place': 'Place X',
        'location.postcode': 'AB1 2A4',
      })
    })
    it('when there are duplicated fields', () => {
      const testPersonObject = {
        name: 'Person1',
        job: { name: 'Company X', title: 'Test role' },
        location: { name: 'Place X', postcode: 'AB1 2A4' },
      }
      expect(flattenObject(testPersonObject)).toEqual({
        name: 'Person1',
        'job.name': 'Company X',
        'job.title': 'Test role',
        'location.name': 'Place X',
        'location.postcode': 'AB1 2A4',
      })
    })
    it('when there are nested duplicated fields', () => {
      const testPersonObject = {
        name: 'Person1',
        job: { attributes: { name: 'Company X', title: 'Test role' } },
        location: { name: 'Place X', postcode: 'AB1 2A4' },
      }
      expect(flattenObject(testPersonObject)).toEqual({
        name: 'Person1',
        'job.attributes.name': 'Company X',
        'job.attributes.title': 'Test role',
        'location.name': 'Place X',
        'location.postcode': 'AB1 2A4',
      })
    })
  })

  describe('alphaNumericSortDefault', () => {
    it('should sorts string by deafult in descending order using alphabetical part first ', () => {
      expect(alphaNumericSortDefault('B-TEST1', 'A-TEST1')).toEqual(1)
      expect(alphaNumericSortDefault('A-TEST1', 'B-TEST1')).toEqual(-1)
      expect(alphaNumericSortDefault('A-TEST1', 'A-TEST1')).toEqual(0)
    })

    it('should sorts string in descending order based on numeric part first ', () => {
      expect(alphaNumericSortDefault('A-TEST1', 'A-TEST2', false)).toEqual(-1)
      expect(alphaNumericSortDefault('A-TEST2', 'A-TEST1', false)).toEqual(1)
      expect(alphaNumericSortDefault('A-TEST2', 'A-TEST2', false)).toEqual(0)
    })
  })

  describe('regexSort', () => {
    it('should sorts string by deafult in descending order using alphabetical part first ', () => {
      expect(
        regexSort('B-TEST1', 'A-TEST1', { alpha: /[^a-zA-Z]*/g, numeric: /[^0-9]*/g }, true),
      ).toEqual(1)
      expect(
        regexSort('A-TEST1', 'B-TEST1', { alpha: /[^a-zA-Z]*/g, numeric: /[^0-9]*/g }, true),
      ).toEqual(-1)
      expect(
        regexSort('A-TEST1', 'A-TEST1', { alpha: /[^a-zA-Z]*/g, numeric: /[^0-9]*/g }, true),
      ).toEqual(0)
    })

    it('should sorts string in descending order based on numeric part first ', () => {
      expect(
        regexSort('A-TEST1', 'A-TEST2', { alpha: /[^a-zA-Z]*/g, numeric: /[^0-9]*/g }, false),
      ).toEqual(-1)
      expect(
        regexSort('A-TEST2', 'A-TEST1', { alpha: /[^a-zA-Z]*/g, numeric: /[^0-9]*/g }, false),
      ).toEqual(1)
      expect(
        regexSort('A-TEST2', 'A-TEST2', { alpha: /[^a-zA-Z]*/g, numeric: /[^0-9]*/g }, false),
      ).toEqual(0)
    })
  })
})
