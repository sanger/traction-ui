<template>
  <div class="pools">
    <traction-list-group class="list-group">
      <tube v-for="pool in pools" :key="pool.id" v-bind="pool"> </tube>
    </traction-list-group>
  </div>
</template>
<script>
import TableHelper from '@/mixins/TableHelper'
import { createNamespacedHelpers } from 'vuex'
import Tube from '@/components/pacbio/PacbioPoolTubeItem'

const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/pools')

export default {
  name: 'PacbioPoolList',
  components: {
    Tube,
  },
  mixins: [TableHelper],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['pools']),
  },
  created() {
    this.provider()
  },
  methods: {
    async provider() {
      try {
        await this.setPools()
      } catch (error) {
        this.showAlert(`Failed to get pools: ${error.message}`, 'danger')
      }
    },
    ...mapActions(['setPools']),
  },
}
</script>
<style scoped>
.pools {
  border: solid;
  border-width: 1px;
  padding: 20px;
}
.list-group {
  max-height: 400px;
  overflow-y: auto;
}
</style>
