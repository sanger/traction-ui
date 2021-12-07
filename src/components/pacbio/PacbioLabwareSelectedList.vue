<template>
  <b-col data-type="selected-plate-list" class="selected-plate-list">
    <!-- eslint-disable vue/attribute-hyphenation-->
    <VueSelecto
      :container="$el"
      :selectableTargets="['ellipse.filled']"
      :continueSelect="true"
      hitRate="20"
      @select="onSelect"
    />
    <!-- eslint-enable vue/attribute-hyphenation -->
    <h3>Selected plates</h3>
    <b-tabs content-class="mt-3" fill>
      <b-tab title="Plates">
        <div class="wrapper">
          <div v-if="selectedPlates.length === 0" data-type="warning-message">
            No plates selected
          </div>
          <div v-for="plate in selectedPlates" :key="plate.id" data-type="selected-plate-item">
            {{ plate.barcode }}
            <Plate ref="plate" v-bind="plate"></Plate>
          </div>
        </div>
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
import { VueSelecto } from 'vue-selecto'

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'traction/pacbio/poolCreate',
)

export default {
  name: 'PacbioLabwareSelectedList',
  components: {
    Plate,
    VueSelecto,
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
    onSelect(e) {
      e.added.forEach((el) => {
        this.selectWellRequests(el.__vue__.$attrs.id)
      })
      e.removed.forEach((el) => {
        this.selectWellRequests(el.__vue__.$attrs.id)
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
.wrapper {
  overflow: scroll;
  display: flex;
  flex-wrap: wrap;
}
.wrapper > div {
  width: 50%;
}
</style>
