<template>
  <div data-type="selected-plate-list">
    <!-- eslint-disable vue/attribute-hyphenation-->
    <VueSelecto
      :container="$el"
      :selectableTargets="['ellipse.filled']"
      :continueSelect="true"
      :keyContainer="$el"
      hitRate="20"
      @select="onSelect"
    />
    <traction-section number="1b" title="Selected Plates">
      <div class="flex flex-col">
        <traction-menu :border="true">
          <traction-menu-item
            v-for="(tabTitle, index) in tabTitles"
            :id="tabTitle"
            :key="index"
            :active="index == sourceIndex"
            color="blue"
            @click="setSource(index)"
            >{{ tabTitle }}</traction-menu-item
          >
        </traction-menu>
        <div v-if="sourceIndex == 0" class="flex overflow-y-auto flex-wrap">
          <div v-if="selectedPlates.length == 0" data-type="warning-message" class="mt-4">
            No plates selected
          </div>

          <div
            v-for="plate in selectedPlates"
            :key="plate.id"
            data-type="selected-plate-item"
            class="w-1/2"
          >
            {{ plate.barcode }}
            <Plate ref="plate" v-bind="plate"></Plate>
            <traction-button
              :id="'remove-plate-btn-' + plate.id"
              class="mt-0"
              @click="deselectPlateAndContents(plate.id)"
              >Remove</traction-button
            >
          </div>
        </div>
        <div v-else id="selectedList" class="mt-4">
          <traction-table
            :items="selectedPlateRequests"
            :fields="requestFields"
            empty-text="No plates selected"
            @row-clicked="requestClicked"
          ></traction-table>
        </div>
      </div>
    </traction-section>
  </div>
</template>

<script>
import Plate from '@/components/pacbio/V1/PacbioPlateItemV1.vue'
import { createNamespacedHelpers } from 'vuex'
import { VueSelecto } from 'vue3-selecto'

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'traction/pacbio/poolCreate',
)

export default {
  name: 'PacbioLabwareSelectedList',
  components: {
    Plate,
    VueSelecto,
  },
  data() {
    return {
      requestFields: [
        { key: 'source_identifier', label: 'Source Identifier' },
        { key: 'sample_species', label: 'Sample species' },
        { key: 'library_type', label: 'Library type' },
        { key: 'number_of_smrt_cells', label: 'Number of smrt cells' },
        { key: 'estimate_of_gb_required', label: 'Estimate of gb required' },
      ],
      sourceIndex: 0,
      tabTitles: ['Plates', 'Requests'],
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
    ...mapActions(['selectWellRequests', 'deselectPlateAndContents']),
    requestClicked({ id, selected }) {
      this.selectRequest({ id, selected: !selected })
    },
    rowClass(item) {
      if (item && item.selected) {
        return 'bg-gray-400'
      }
    },
    onSelect(e) {
      e.added.forEach((el) => {
        this.selectWellRequests(el.getAttribute('id'))
      })
      e.removed.forEach((el) => {
        this.selectWellRequests(el.getAttribute('id'))
      })
    },
    setSource(indx) {
      this.sourceIndex = indx
    },
  },
}
</script>
