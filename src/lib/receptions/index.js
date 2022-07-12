import ByBarcode from '@/components/receptions/ByBarcode.vue'
import * as Sequencescape from './Sequencescape'
import * as SamplesExtraction from './SamplesExtraction'

const ReceptionForms = [
  {
    title: 'PacBio Options',
    description: 'PacBio Specific Request Options',
    fields: [
      {
        label: 'Number of Gigabases required',
        component: 'input',
        attribute: 'estimate_of_gb_required',
        description: 'Some additional text',
        componentProps: {
          type: 'number',
          step: 1,
          minimum: 0,
        },
      },
      {
        label: 'Number of SMRT cells',
        component: 'input',
        attribute: 'number_of_smrt_cells',
        description: 'Some additional text',
        componentProps: {
          type: 'number',
          step: 1,
          minimum: 0,
        },
      },
    ],
  },
  {
    title: 'ONT Options',
    description: 'ONT Specific Request Options',
    fields: [
      {
        label: 'Data Type',
        component: 'select',
        attribute: 'data_type',
        description: 'Some additional text',
        componentProps: {},
      },
      {
        label: 'Number of Flowcells',
        component: 'input',
        attribute: 'number_of_flowcells',
        description: 'Some additional text',
        componentProps: {
          type: 'number',
          step: 1,
          minimum: 0,
        },
      },
    ],
  },
]

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
    component: ByBarcode,
    props: {
      importFunction: Sequencescape.labwareForReception,
      source: 'sequencescape',
      title: 'Sequencescape',
    },
  },
  {
    name: 'Samples Extraction',
    component: ByBarcode,
    props: {
      importFunction: SamplesExtraction.labwareForReception,
      source: 'samples-extraction',
      title: 'Samples Extraction',
    },
  },
]

export default Receptions
export { ReceptionForms, defaultRequestOptions }
