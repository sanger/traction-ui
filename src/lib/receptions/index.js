import ByBarcode from '@/components/receptions/ByBarcode.vue'
import * as Sequencescape from './Sequencescape'
import * as SamplesExtraction from './SamplesExtraction'

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
