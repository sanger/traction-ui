import { wellFor, wellToIndex, wellNameToCoordinate } from '@/stores/utilities/wellHelpers.js'
import { describe } from 'vitest'

describe('wellHelpers', () => {
  describe('wellFor', () => {
    it('returns the correct well for a given request_id', () => {
      const wells = {
        1: { id: '1', position: 'A1', requests: ['1', '2'] },
        2: { id: '2', position: 'B1', requests: ['1', '2'] },
        3: { id: '3', position: 'C1', requests: ['1', '2'] },
      }
      const result = wellFor(wells, 1)
      expect(result).toEqual(wells[1])
    })
  })
  describe('wellNameToCoordinate', () => {
    it('returns the correct coordinates for a given well position', () => {
      const result = wellNameToCoordinate('A1')
      expect(result).toEqual([0, 0])
    })
  })
  describe('wellToIndex', () => {
    it('returns the correct index for a given well position', () => {
      const result = wellToIndex({ position: 'A1' })
      expect(result).toEqual(0)
    })
  })
})
