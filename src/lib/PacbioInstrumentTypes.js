import { LabwareTypes } from '@/lib/LabwareTypes'

/**
 * A collection of methods to deal with Pacbio Instrument Types
 * we could possibly add these methods to the object itself
 * which would be better for naming and usage
 * @module PacbioInstrumentTypes
 */

/**
 * @typedef PacbioInstrumentType
 * @property {String} name
 * @property {Number} plateCount
 * @property {LabwareType} labwareType
 * @property {String} plateClasses
 * @property {Number} sequencingKitBoxBarcodeLength
 *
 */
const PacbioInstrumentTypes = {
  Revio: {
    key: 'Revio',
    name: 'Revio',
    plateCount: 2,
    labwareType: LabwareTypes.Plate4,
    plateClasses: 'w-32 mx-auto',
    sequencingKitBoxBarcodeLength: 28,
  },
  SequelIIe: {
    key: 'SequelIIe',
    name: 'Sequel IIe',
    plateCount: 1,
    labwareType: LabwareTypes.Plate96,
    plateClasses: 'w-full',
    sequencingKitBoxBarcodeLength: 21,
  },
}

/**
 * @param {Object} plate
 * @param {PacbioInstrumentType} instrumentType
 * @returns {Object} {valid: Boolean, error: String}
 * validates the sequencing kit box barcode for a plate
 * returns an object with a valid boolean and an error string
 * if the sequencing kit box barcode is valid, valid is true and error is an empty string
 * if the sequencing kit box barcode is invalid, valid is false and error is a string
 * if the sequencing kit box barcode is empty, valid is null and error is an empty string
 */
const validatePlate = ({ plate: { sequencing_kit_box_barcode }, instrumentType }) => {
  const currentLength = sequencing_kit_box_barcode.length
  const expectedLength = instrumentType.sequencingKitBoxBarcodeLength
  const valid = currentLength == 0 ? null : currentLength == expectedLength
  const validationMessage = `Invalid Sequencing Kit Barcode (length ${currentLength}/${expectedLength})`

  const error = valid == null ? '' : valid ? '' : validationMessage

  return { valid, error }
}

export { PacbioInstrumentTypes, validatePlate }
