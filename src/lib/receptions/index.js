import * as Sequencescape from './Sequencescape'
import * as SamplesExtraction from './SamplesExtraction'

const defaultRequestOptions = () => ({
  library_type: undefined,
  cost_code: null,
  estimate_of_gb_required: null,
  number_of_smrt_cells: null,
  number_of_flowcells: null,
  data_type: null,
})

const Receptions = [
  {
    name: 'Sequencescape',
    text: 'Sequencescape',
    value: 'Sequencescape',
    props: {
      importFunction: Sequencescape.labwareForReception,
      source: 'sequencescape',
      title: 'Sequencescape',
    },
  },
  {
    name: 'Samples Extraction',
    text: 'Samples Extraction',
    value: 'Samples Extraction',
    props: {
      importFunction: SamplesExtraction.labwareForReception,
      source: 'samples-extraction',
      title: 'Samples Extraction',
    },
  },
]

export default Receptions
export { defaultRequestOptions }
