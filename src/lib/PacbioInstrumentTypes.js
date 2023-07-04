import { LabwareTypes } from '@/lib/LabwareTypes'

const PacbioInstrumentTypes = {
  Revio: {
    name: 'Revio',
    plateCount: 1,
    labwareType: LabwareTypes.Plate4,
    plateClasses: 'w-32 mx-auto',
  },
  SequelIIe: {
    name: 'Sequel IIe',
    plateCount: 1,
    labwareType: LabwareTypes.Plate96,
    plateClasses: 'w-full',
  },
}

export { PacbioInstrumentTypes }
