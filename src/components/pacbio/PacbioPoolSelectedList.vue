<template>
  <div class="list-group">
    <tube v-for="pool in pools" :key="pool.id" v-bind="pool"> </tube>
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
.list-group {
  max-height: 500px;
  overflow-y: auto;
}
</style>
