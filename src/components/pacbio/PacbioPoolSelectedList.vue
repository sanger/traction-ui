<template>
  <div data-type="selected-pool-list">
      <div class="flex flex-col">
        <div class="pools">
          <traction-list-group class="list-group">
            <tube v-for="pool in pools" :key="pool.id" v-bind="pool"> </tube>
          </traction-list-group>
        </div>
      </div>
  </div>
</template>

<script>
import Tube from '@/components/pacbio/PacbioPoolTubeItem'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('traction/pacbio/runCreate')

export default {
  name: 'PacbioPoolSelectedList',
  components: {
    Tube,
  },
  computed: {
    ...mapGetters(['pools']),
  },
}
</script>
<style scoped>
/* .pools {
  border: solid;
  border-width: 1px;
  padding: 20px;
} */
.list-group {
  max-height: 400px;
  overflow-y: auto;
}
</style>
