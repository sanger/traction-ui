import * as SamplesExtractionV1 from './SamplesExtractionV1'
import * as SamplesExtractionV2 from './SamplesExtractionV2'

// DEPRECATED - remove once dpl_877_reception_request is enabled by default
import * as SequencescapeV1 from './SequencescapeV1'
import * as SequencescapeV2 from './SequencescapeV2'

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
}

// TO MODIFY - remove versions once dpl_877_reception_request is enabled by default
const Receptions = {
  options: Object.values(ReceptionTypes),
  Sequencescape: {
    v1: {
      ...ReceptionTypes.Sequencescape,
      importFunction: SequencescapeV1.labwareForReception,
    },
    v2: {
      ...ReceptionTypes.Sequencescape,
      importFunction: SequencescapeV2.labwareForReception,
    },
  },
  SamplesExtraction: {
    v1: {
      ...ReceptionTypes.SamplesExtraction,
      importFunction: SamplesExtractionV1.labwareForReception,
    },
    v2: {
      ...ReceptionTypes.SamplesExtraction,
      importFunction: SamplesExtractionV2.labwareForReception,
    },
  },
}

export default Receptions
export { defaultRequestOptions }
