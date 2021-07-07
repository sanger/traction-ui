<template>
  <b-tabs content-class="mt-3" fill>
    <b-tab title="Plates">
      <b-list-group class="selected-list-group">
        <b-list-group-item v-if="selectedPlates.length === 0">
          No plates selected
        </b-list-group-item>
        <b-list-group-item
          v-for="plate in selectedPlates"
          :key="plate.id"
          class="selected-list-item"
        >
          {{ plate.barcode }}
          <Plate ref="plate" v-bind="plate" @clickWell="selectWellRequests"></Plate>
          <b-button id="unselect-btn" variant="danger" size="sm" @click="setSelected(plate)"
            >Deselect</b-button
          >
        </b-list-group-item>
      </b-list-group>
    </b-tab>
    <b-tab title="Requests"> </b-tab>
  </b-tabs>
</template>

<script>
import Helper from '@/mixins/Helper'
import Plate from '@/components/pacbio/PacbioPlateItem'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'traction/pacbio/poolCreate',
)

export default {
  name: 'PacbioLabwareSelectedList',
  components: {
    Plate,
  },
  mixins: [Helper],
  computed: {
    ...mapGetters(['selectedPlates']),
  },
  methods: {
    setSelected(labware) {
      this.selectPlate({ id: labware.id, selected: false })
    },
    ...mapMutations(['selectPlate']),
    ...mapActions(['selectWellRequests']),
  },
}
</script>

<style>
.selected-list-group {
  overflow: scroll;
  max-height: 700px;
}
</style>
