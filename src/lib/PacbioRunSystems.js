import { LabwareTypes } from '@/lib/LabwareTypes'

const PacbioRunSystems = {
  Revio: {
    name: 'Revio',
    plateCount: 2,
    labwareType: LabwareTypes.Plate4,
    plateClasses: 'w-1/3 mx-auto',
  },
  SequelIIe: {
    name: 'Sequel IIe',
    plateCount: 1,
    labwareType: LabwareTypes.Plate96,
    plateClasses: 'w-full',
  },
}

export { PacbioRunSystems }
