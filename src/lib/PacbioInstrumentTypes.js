import { LabwareTypes } from '@/lib/LabwareTypes'

const PacbioInstrumentTypes = {
  Revio: {
    name: 'Revio',
    plateCount: 1,
    labwareType: LabwareTypes.Plate4,
    plateClasses: 'w-32 mx-auto',
    sequencingKitBoxBarcodeLength: 28,
  },
  SequelIIe: {
    name: 'Sequel IIe',
    plateCount: 1,
    labwareType: LabwareTypes.Plate96,
    plateClasses: 'w-full',
    sequencingKitBoxBarcodeLength: 21,
  },
}

/**
 *
 * @param {String} name
 * @param {Object} instrumentTypeList
 * @returns PacbioInstrumentType || undefined
 * finds the Pacbio Instrument Type by name
 */
const findInstrumentByName = (name, instrumentTypeList) => {
  return Object.values(instrumentTypeList).find((instrument) => instrument.name === name)
}

export { PacbioInstrumentTypes, findInstrumentByName }
