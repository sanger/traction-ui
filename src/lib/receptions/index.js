import * as Sequencescape from './SequencescapeV1'
import * as SamplesExtraction from './SamplesExtractionV1'

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
    value: 'Samples Extraction',
  },
}

const Receptions = [
  {
    name: 'sequencescape',
    text: 'Sequencescape',
    value: 'Sequencescape',
    importFunction: Sequencescape.labwareForReception,
  },
  {
    name: 'samples-extraction',
    text: 'Samples Extraction',
    value: 'Samples Extraction',
    importFunction: SamplesExtraction.labwareForReception,
  },
]

export default Receptions
export { defaultRequestOptions }
