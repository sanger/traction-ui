import ByBarcode from '@/components/receptions/ByBarcode.vue'
import * as Sequencescape from './Sequencescape'
import * as SamplesExtraction from './SamplesExtraction'
import DataTypeSelect from '@/components/shared/DataTypeSelect'

const ReceptionForms = [
  {
    title: 'PacBio Options',
    fields: [
      {
        label: 'Number of Gigabases required',
        component: 'traction-input',
        attribute: 'estimate_of_gb_required',
        componentProps: {
          type: 'number',
          step: 1,
          minimum: 0,
        },
      },
      {
        label: 'Number of SMRT cells',
        component: 'traction-input',
        attribute: 'number_of_smrt_cells',
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
    fields: [
      {
        label: 'Data Type',
        component: DataTypeSelect,
        attribute: 'data_type',
        componentProps: {
          pipeline: 'ont',
        },
      },
      {
        label: 'Number of Flowcells',
        component: 'traction-input',
        attribute: 'number_of_flowcells',
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
