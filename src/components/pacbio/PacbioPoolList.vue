<template>
  <traction-section title="Pools">
    <LabwareFinder :fetcher="findPools" filter="barcode" />
    <PacbioPoolSelectedList></PacbioPoolSelectedList>
  </traction-section>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import LabwareFinder from '@/components/LabwareFinder'
import PacbioPoolSelectedList from './PacbioPoolSelectedList.vue'

const { mapActions } = createNamespacedHelpers('traction/pacbio/runCreate')

export default {
  name: 'PacbioPoolList',
  components: {
    LabwareFinder,
    PacbioPoolSelectedList,
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(['findPools']),
  },
}
</script>
