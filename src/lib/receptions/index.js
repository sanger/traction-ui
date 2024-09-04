import * as SamplesExtraction from './SamplesExtraction.js'
import * as Sequencescape from './Sequencescape.js'
import * as SequencescapeTubes from './SequencescapeTubes.js'
import * as SequencescapeMultiplexedLibraries from './SequencescapeMultiplexedLibraries.js'

import MultiBarcode from '@/components/reception/MultiBarcode.vue'
import MultiplexedLibraryBarcode from '@/components/reception/MultiplexedLibraryBarcode.vue'

const defaultRequestOptions = () => ({
  library_type: undefined,
  cost_code: null,
  estimate_of_gb_required: null,
  number_of_smrt_cells: null,
  number_of_flowcells: null,
})

const ReceptionTypes = {
  Sequencescape: {
    name: 'sequencescape',
    text: 'Sequencescape',
    value: 'Sequencescape',
    pipelines: ['PacBio', 'ONT'],
  },
  SamplesExtraction: {
    name: 'samples-extraction',
    text: 'Samples Extraction',
    value: 'SamplesExtraction',
    pipelines: ['PacBio', 'ONT'],
  },
  SequencescapeTubes: {
    name: 'sequencescape-tubes',
    text: 'Sequencescape Tubes',
    value: 'SequencescapeTubes',
    pipelines: ['PacBio', 'ONT'],
  },
  SequencescapeMultiplexedLibraries: {
    name: 'sequencescape-multiplexed-libraries',
    text: 'Sequencescape Multiplexed Libraries',
    value: 'SequencescapeMultiplexedLibraries',
    pipelines: ['ONT'],
  },
}

const Receptions = {
  options: Object.values(ReceptionTypes),
  Sequencescape: {
    ...ReceptionTypes.Sequencescape,
    fetchFunction: Sequencescape.fetchLabwareForReception,
    barcodeComponent: MultiBarcode,
    getAttributeKeysFunction: Sequencescape.getAttributeKeys,
  },
  SamplesExtraction: {
    ...ReceptionTypes.SamplesExtraction,
    fetchFunction: SamplesExtraction.fetchLabwareForReception,
    barcodeComponent: MultiBarcode,
    getAttributeKeysFunction: SamplesExtraction.getAttributeKeys,
  },
  SequencescapeTubes: {
    ...ReceptionTypes.SequencescapeTubes,
    fetchFunction: SequencescapeTubes.fetchLabwareForReception,
    barcodeComponent: MultiBarcode,
    getAttributeKeysFunction: SequencescapeTubes.getAttributeKeys,
  },
  SequencescapeMultiplexedLibraries: {
    ...ReceptionTypes.SequencescapeMultiplexedLibraries,
    fetchFunction: SequencescapeMultiplexedLibraries.fetchLabwareForReception,
    barcodeComponent: MultiplexedLibraryBarcode,
    getAttributeKeysFunction: SequencescapeMultiplexedLibraries.getAttributeKeys,
  },
}

export default Receptions
export { defaultRequestOptions }
