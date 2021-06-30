<template>
  <b-tabs content-class="mt-3" fill>
    <b-tab title="Plates">
      <b-list-group class="selected-list-group">
        <b-list-group-item v-if="selectedPlates.length === 0">
          No plates selected
        </b-list-group-item>
        <b-list-group-item v-for="item in selectedPlates" :key="item.id" class="selected-list-item">
          {{ item.attributes.barcode }}
          <Plate ref="plate" :plate="formattedPlate(item)" height="75%" width="75%"></Plate>
          <b-button id="unselect-btn" variant="danger" size="sm" @click="setSelected(item)"
            >Deselect</b-button
          >
        </b-list-group-item>
      </b-list-group>
    </b-tab>
    <b-tab title="Requests">
      <b-list-group class="selected-list-group">
        <b-list-group-item v-if="selectedRequests.length === 0">
          Select a plate to see requests
        </b-list-group-item>
        <b-list-group-item
          v-for="item in selectedRequests"
          :key="item.id"
          class="selected-list-item"
        >
          Sample: {{ item.attributes.sample_name }}
          <br />
          Source: {{ item.attributes.source_identifier }}
        </b-list-group-item>
      </b-list-group>
    </b-tab>
  </b-tabs>
</template>

<script>
import Helper from '@/mixins/Helper'
import Plate from '@/components/plates/PlateItem'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioLabwareSelectedList',
  components: {
    Plate,
  },
  mixins: [Helper],
  computed: {
    ...mapGetters(['selectedPlates', 'selectedRequests']),
  },
  methods: {
    formattedPlate(item) {
      const plate = { ...item }
      plate.wells = plate.relationships.wells.data
      return plate
    },
    setSelected(labware) {
      this.selectPlate({ id: labware.id, selected: false })
      this.selectPlateRequests({ barcode: labware.attributes.barcode, selected: false })
    },
    ...mapMutations(['selectPlate', 'selectPlateRequests']),
  },
}
</script>

<style>
.selected-list-group {
  overflow: scroll;
  max-height: 700px;
}
</style>
