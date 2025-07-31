import * as KinnexSamples from '@/lib/reports/KinnexReport.js'

const ReceptionTypes = {
  KinnexSamples: {
    text: 'Kinnex Samples',
    value: 'KinnexSamples',
  },
}

const Reports = {
  KinnexSamples: {
    ...ReceptionTypes.KinnexSamples,
    fetchFunction: KinnexSamples.fetchFunction,
    csvStructure: KinnexSamples.csvStructure,
  },
}

export default Reports
