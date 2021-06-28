<template>
  <div class="selected-list">
    <h3>Selected labware</h3>
    <b-list-group>
      <b-list-group-item
        v-for="item in selectedPlates"
        :key="item.id"
        button
        @click="selectLabware(item)"
      >
        Plate: {{ item.barcode }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioLabwareSelectedList',
  mixins: [Helper],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['selectedPlates']),
  },
  async mounted() {},
  methods: {},
}
</script>

<style>
.selected-list {
  max-width: 400px;
}

.list-group {
  max-width: 400px;
  overflow: scroll;
}
</style>
