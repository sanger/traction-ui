import { populateById } from '@/api/JsonApi'

export default {
  setRuns: populateById('runs', { includeRelationships: true }, true),
  populateInstruments: populateById('instruments', { includeRelationships: true }),
}
