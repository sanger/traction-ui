<template>
  <div class="pools">
    <traction-section title="Pools"></traction-section>
    <LabwareFinder :fetcher="findPools" filter="barcode" />
    <PacbioPoolSelectedList></PacbioPoolSelectedList>
  </div>
</template>
<script>
import TableHelper from '@/mixins/TableHelper'
import { createNamespacedHelpers } from 'vuex'
import LabwareFinder from '@/components/LabwareFinder'
import PacbioPoolSelectedList from './PacbioPoolSelectedList.vue'

const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/runCreate')

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
  computed: {
    ...mapGetters(['pools']),
  },
  methods: {
    ...mapActions(['findPools']),
  },
}
</script>
<style scoped>
.pools {
  border: solid;
  border-width: 1px;
  padding: 20px;
}
</style>
