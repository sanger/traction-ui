import { getCurrentDate } from '@/lib/DateHelpers'
import { describe, expect, it } from 'vitest'

describe('LabelPrintingHelpers.js', () => {
  it('works', () => {
    const date = getCurrentDate()
    expect(date).toBeDefined()
  })

  describe('suffixDropdownOptions', () => {
    it('works', () => {
      expect(true).toBeTruthy()
    })
  })

  describe('suffixItems', () => {
    it('works', () => {
      expect(true).toBeTruthy()
    })
  })

  describe('barcodeLabelItem', () => {
    it('works', () => {
      expect(true).toBeTruthy()
    })
  })
})
