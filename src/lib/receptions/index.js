import ByBarcode from '@/components/receptions/ByBarcode.vue'
import { labwareForReception } from '@/services/SequencescapeReception'

const Receptions = [
  {
    name: 'Sequencescape',
    component: ByBarcode,
    props: {
      importFunction: labwareForReception,
      source: 'sequencescape',
      title: 'Sequencescape',
    },
  },
  {
    name: 'Samples Extraction',
    component: ByBarcode,
    props: {
      importFunction: () => {},
      source: 'samples-extraction',
      title: 'Samples Extraction',
    },
  },
]

export default Receptions
