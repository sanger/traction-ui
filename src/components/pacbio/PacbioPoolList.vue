<template>
  <div class="pools">
    <LabwareFinder :fetcher="setPools" filter="barcode" />
    <PacbioPoolSelectedList></PacbioPoolSelectedList>
  </div>
</template>
<script>
import TableHelper from '@/mixins/TableHelper'
import { createNamespacedHelpers } from 'vuex'
import LabwareFinder from '@/components/LabwareFinder'
import PacbioPoolSelectedList from './PacbioPoolSelectedList.vue'

const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/pools')

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
  // created() {
  //   this.provider()
  // },
  methods: {
    // async provider() {
    //   try {
    //     await this.setPools()
    //   } catch (error) {
    //     this.showAlert(`Failed to get pools: ${error.message}`, 'danger')
    //   }
    // },
    ...mapActions(['setPools']),
  },
}
</script>
<style scoped></style>
