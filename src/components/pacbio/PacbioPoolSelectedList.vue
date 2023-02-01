<template>
  <div data-type="selected-pool-list">
    <traction-section title="Selected Pools">
      <div class="flex flex-col">
        <!-- display warning message if no pools are selected-->

        <div class="pools">
          <traction-list-group class="list-group">
            <tube v-for="pool in pools" :key="pool.id" v-bind="pool"> </tube>
          </traction-list-group>
        </div>
      </div>
    </traction-section>
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
