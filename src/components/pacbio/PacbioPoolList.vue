<template>
  <div class="libraries">
    <b-list-group class="list-group">
      <tube v-for="library in libraries" :key="library.id" v-bind="library"> </tube>
    </b-list-group>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import { createNamespacedHelpers } from 'vuex'
import Tube from '@/components/pacbio/PacbioPoolTubeItem'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/libraries')

export default {
  name: 'PacbioPoolList',
  components: {
    Tube,
  },
  mixins: [Helper, TableHelper],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['libraries']),
  },
  created() {
    this.provider()
  },
  methods: {
    async provider() {
      try {
        await this.setLibraries()
      } catch (error) {
        this.showAlert(`Failed to get pools: ${error.message}`, 'danger')
      }
    },
    ...mapActions(['setLibraries']),
  },
}
</script>

<style>
.libraries {
  border: solid;
  border-width: 1px;
  padding: 20px;
}

.list-group {
  max-height: 400px;
  overflow: scroll;
}
</style>
