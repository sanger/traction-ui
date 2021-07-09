<template>
  <b-col data-type="selected-plate-list">
    <h3>Selected plates</h3>
    <b-tabs content-class="mt-3" fill>
      <b-tab title="Plates">
        <b-list-group class="selected-list-group wrapper">
          <b-list-group-item v-if="selectedPlates.length === 0">
            No plates selected
          </b-list-group-item>
          <b-list-group-item
            v-for="plate in selectedPlates"
            :key="plate.id"
          >
            {{ plate.barcode }}
            <Plate ref="plate" v-bind="plate" @clickWell="selectWellRequests"></Plate>
          </b-list-group-item>
        </b-list-group>
      </b-tab>
      <b-tab title="Requests">
        <b-list-group class="selected-list-group">
          <b-table
            :items="selectedPlateRequests"
            show-empty
            small
            :fields="requestFields"
            :tbody-tr-class="rowClass"
            empty-text="No plates selected"
            @row-clicked="requestClicked"
          ></b-table>
        </b-list-group>
      </b-tab>
    </b-tabs>
  </b-col>
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
  data() {
    return {
      requestFields: [
        'source_identifier',
        'sample_species',
        'library_type',
        'number_of_smrt_cells',
        'estimate_of_gb_required',
      ],
    }
  },
  computed: {
    ...mapGetters(['selectedPlates', 'wellList', 'requestList']),
    selectedPlateRequests() {
      // Not really sure this belongs here, and I'd prefer to see this handled
      // in the getters.
      return this.selectedPlates.flatMap((plate) => {
        return this.wellList(plate.wells).flatMap((well) => {
          return this.requestList(well.requests || [])
        })
      })
    },
  },
  methods: {
    ...mapMutations(['selectPlate', 'selectRequest']),
    ...mapActions(['selectWellRequests']),
    requestClicked({ id, selected }) {
      this.selectRequest({ id, selected: !selected })
    },
    rowClass(item) {
      if (item && item.selected) {
        return 'table-primary'
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
.wrapper {
  display: flex;
  flex-flow: row nowrap;
}
.list-group-item {
  padding: 0;
  border: none;
}
</style>
