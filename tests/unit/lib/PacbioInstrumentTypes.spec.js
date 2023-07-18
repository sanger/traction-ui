import {PacbioInstrumentTypes, findInstrumentByName } from '@/lib/PacbioInstrumentTypes'
import { expect } from 'vitest'

describe('PacbioInstrumentTypes', () => {
  it('#findInstrumentByName', () => {
    expect(findInstrumentByName('Sequel IIe', PacbioInstrumentTypes)).toEqual(PacbioInstrumentTypes.SequelIIe)
    expect(findInstrumentByName('War on Drugs', PacbioInstrumentTypes)).not.toBeDefined()
  })

})
