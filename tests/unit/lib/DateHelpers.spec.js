import { getCurrentDate, flattenObject } from '@/lib/DateHelpers'

describe('dateHelpers', () => {
  describe('getCurrentData', () => {
    beforeEach(() => {
      // tell vitest we use mocked time
      vi.useFakeTimers()
    })

    afterEach(() => {
      // restoring date after each test run
      vi.useRealTimers()
    })

    it('#getCurrentDate', () => {
      // https://vitest.dev/guide/mocking.html
      const date = new Date('2022-11-22T08:51:46.326Z')
      vi.setSystemTime(date)

      expect(getCurrentDate()).toEqual('22-Nov-22')
    })
  })

  describe('flattenObject', () => {
    it('should flatten an object', () => {
      const testPersonObject = {
        name: 'Person1',
        job: { company: 'Company X', title: 'Test role' },
        location: { place: 'Place X', postcode: 'AB1 2A4' },
      }
      expect(flattenObject(testPersonObject)).toEqual({
        name: 'Person1',
        company: 'Company X',
        title: 'Test role',
        place: 'Place X',
        postcode: 'AB1 2A4',
      })
    })
    it('when there  are duplicated fields', () => {
      const testPersonObject = {
        name: 'Person1',
        job: { name: 'Company X', title: 'Test role' },
        location: { name: 'Place X', postcode: 'AB1 2A4' },
      }
      expect(flattenObject(testPersonObject)).toEqual({
        name: 'Person1',
        'job.name': 'Company X',
        title: 'Test role',
        'location.name': 'Place X',
        postcode: 'AB1 2A4',
      })
    })
  })
})
