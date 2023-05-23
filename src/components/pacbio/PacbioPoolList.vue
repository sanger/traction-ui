<template>
  <div class="p-[20px] border-solid border-[1px] border-black">
    <div class="font-semibold text-xl text-left py-3">Pools</div>
    <LabwareFinder :fetcher="findPools" filter="barcode" />
    <PacbioPoolSelectedList></PacbioPoolSelectedList>
  </div>
</template>
<script>
import TableHelper from '@/mixins/TableHelper'
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
  mixins: [TableHelper],
  data() {
    return {}
  },
  methods: {
    ...mapActions(['findPools']),
  },
}
</script>
