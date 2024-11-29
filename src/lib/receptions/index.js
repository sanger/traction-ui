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
  data_type: null,
})

const WorkflowsLocations = {
  Extractions: {
    pipelines: ['ONT', 'PacBio'],
    name: 'Extractions -80 samples',
    location: 'Long Read DTOL Freezer 2/Shelf 3/Rack 3',
    barcode: 'lw-drawer-2-30398',
  },
  ONT: {
    pipelines: ['ONT'],
    name: 'ONT -20 samples',
    location: 'LRT020 Draw 1',
    barcode: 'lw-drawer-1-37292',
  },
  OntFridgeSamples: {
    pipelines: ['ONT'],
    name: 'ONT Fridge samples',
    location: 'LTR018 Shelf 1',
    barcode: 'lw-shelf-1-30503',
  },
  Pacbio: {
    pipelines: ['PacBio'],
    name: 'Pacbio -20 samples',
    location: 'LRT006 Draw 1',
    barcode: 'lw-shelf-1-30472',
  },
  PacbioFridgeSamples: {
    pipelines: ['PacBio'],
    name: 'Pacbio Fridge samples',
    location: 'LRT007 – Shelf 1',
    barcode: 'lw-shelf-1-30451',
  },
}

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
export { defaultRequestOptions, WorkflowsLocations }
