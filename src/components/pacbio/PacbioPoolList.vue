<template>
  <traction-section title="Pools">
    <LabwareFinder :fetcher="findPools" filter="barcode" />
    <PacbioPoolSelectedList></PacbioPoolSelectedList>
  </traction-section>
</template>
<script>

import TableHelper from '@/mixins/TableHelper'
import LabwareFinder from '@/components/LabwareFinder'
import PacbioPoolSelectedList from './PacbioPoolSelectedList.vue'
import { mapState } from 'pinia'
import { usePacbioRunCreate } from '@/stores/pacbioRunCreate'

export default {
  name: 'PacbioPoolList',
  components: {
    LabwareFinder,
    PacbioPoolSelectedList,
  },
  mixins: [TableHelper],
  data() {
    return {}
  },
  methods: {
    ...mapState(usePacbioRunCreate,['findPools']),
  },
}
</script>
