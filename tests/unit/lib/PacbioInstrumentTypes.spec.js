import { PacbioInstrumentTypes, validatePlate } from '@/lib/PacbioInstrumentTypes'
import { describe, expect } from 'vitest'

describe('PacbioInstrumentTypes', () => {
  describe('validatePlate', () => {
    describe('for a Sequel IIe', () => {
      it('errors if sequencing kit box barcode is not valid', () => {
        const plate = { sequencing_kit_box_barcode: 'some value', plate_number: 1 }
        expect(validatePlate({ plate, instrumentType: PacbioInstrumentTypes.SequelIIe })).toEqual({
          valid: false,
          error: 'Invalid Sequencing Kit Barcode (length 10/21)',
        })
      })

      it('does not error if sequencing kit box barcode is valid', async () => {
        const plate = { sequencing_kit_box_barcode: 'twentyonecharacters00', plate_number: 1 }
        expect(validatePlate({ plate, instrumentType: PacbioInstrumentTypes.SequelIIe })).toEqual({
          valid: true,
          error: '',
        })
      })

      it('does not error if SequencingKitBoxBarcode is empty', async () => {
        const plate = { sequencing_kit_box_barcode: '', plate_number: 1 }
        expect(validatePlate({ plate, instrumentType: PacbioInstrumentTypes.SequelIIe })).toEqual({
          valid: null,
          error: '',
        })
      })
    })

    describe('for a Revio', () => {
      it('errors if sequencing kit box barcode is not valid', async () => {
        const plate = { sequencing_kit_box_barcode: 'some value', plate_number: 1 }
        expect(validatePlate({ plate, instrumentType: PacbioInstrumentTypes.Revio })).toEqual({
          valid: false,
          error: 'Invalid Sequencing Kit Barcode (length 10/28)',
        })
      })

      it('does not error if sequencing kit box barcode is valid', async () => {
        const plate = {
          sequencing_kit_box_barcode: '1021188000301570037320231019',
          plate_number: 1,
        }
        expect(validatePlate({ plate, instrumentType: PacbioInstrumentTypes.Revio })).toEqual({
          valid: true,
          error: '',
        })
      })

      it('does not error if sequencing kit box barcode is empty', async () => {
        const plate = { sequencing_kit_box_barcode: '', plate_number: 1 }
        expect(validatePlate({ plate, instrumentType: PacbioInstrumentTypes.Revio })).toEqual({
          valid: null,
          error: '',
        })
      })
    })
  })
})
