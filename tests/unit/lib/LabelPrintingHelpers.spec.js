import { getCurrentDate } from '@/lib/DateHelpers'
import { expect } from 'vitest'

describe('LabelPrintingHelpers.js', () => {
  it('works', () => {
    const date = getCurrentDate()
    expect(date).toBeDefined()
  })
})
