import { annotationType } from '@/stores/utilities/annotation.js'
import { describe, it } from 'vitest'

describe('annotation.js', () => {
  describe('annotationType', () => {
    it('should return an empty object', () => {
      const result = annotationType()
      expect(result).toEqual({})
    })
  })
})
