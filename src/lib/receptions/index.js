import * as SamplesExtraction from './SamplesExtraction.js'
import * as Sequencescape from './Sequencescape.js'
import * as SequencescapeTubes from './SequencescapeTubes.js'
import * as SequencescapeMultiplexedLibraries from './SequencescapeMultiplexedLibraries.js'

const defaultRequestOptions = () => ({
  library_type: undefined,
  cost_code: null,
  estimate_of_gb_required: null,
  number_of_smrt_cells: null,
  number_of_flowcells: null,
  data_type: null,
})

const ReceptionTypes = {
  Sequencescape: {
    name: 'sequencescape',
    text: 'Sequencescape',
    value: 'Sequencescape',
  },
  SamplesExtraction: {
    name: 'samples-extraction',
    text: 'Samples Extraction',
    value: 'SamplesExtraction',
  },
  SequencescapeTubes: {
    name: 'sequencescape-tubes',
    text: 'Sequencescape Tubes',
    value: 'SequencescapeTubes',
  },
  SequencescapeMultiplexedLibraries: {
    name: 'sequencescape-multiplexed-libraries',
    text: 'Sequencescape Multiplexed Libraries',
    value: 'SequencescapeMultiplexedLibraries',
  },
}

const Receptions = {
  options: Object.values(ReceptionTypes),
  Sequencescape: {
    ...ReceptionTypes.Sequencescape,
    fetchFunction: Sequencescape.fetchLabwareForReception,
    getAttributeKeysFunction: Sequencescape.getAttributeKeys,
  },
  SamplesExtraction: {
    ...ReceptionTypes.SamplesExtraction,
    fetchFunction: SamplesExtraction.fetchLabwareForReception,
    getAttributeKeysFunction: SamplesExtraction.getAttributeKeys,
  },
  SequencescapeTubes: {
    ...ReceptionTypes.SequencescapeTubes,
    fetchFunction: SequencescapeTubes.fetchLabwareForReception,
    getAttributeKeysFunction: SequencescapeTubes.getAttributeKeys,
  },
  SequencescapeMultiplexedLibraries: {
    ...ReceptionTypes.SequencescapeMultiplexedLibraries,
    fetchFunction: SequencescapeMultiplexedLibraries.fetchLabwareForReception,
    getAttributeKeysFunction: SequencescapeMultiplexedLibraries.getAttributeKeys,
  },
}

export default Receptions
export { defaultRequestOptions }
