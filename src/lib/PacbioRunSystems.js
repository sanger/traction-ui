import { LabwareTypes } from '@/lib/LabwareTypes'

const PacbioRunSystems = {
  Revio: {
    name: 'Revio',
    plateCount: 2,
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

export { PacbioRunSystems }
