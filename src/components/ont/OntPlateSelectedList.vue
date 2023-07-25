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
        <div v-if="sourceIndex == 0" class="wrapper">
          <div v-if="selectedPlates.length == 0" data-type="warning-message" class="mt-4">
            No plates selected
          </div>

          <div v-for="plate in selectedPlates" :key="plate.id" data-type="selected-plate-item">
            {{ plate.barcode }}
            <Plate ref="plate" v-bind="plate" :wellData="wellList(plate.wells)"></Plate>
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
import Plate from '@/components/ont/OntPlateItem'
import { createNamespacedHelpers } from 'vuex'
import { VueSelecto } from 'vue3-selecto'

// TODO: Does this need to be moved to top level ONT?
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('traction/ont/pools')

/**
 * # OntPlateSelectedList
 *
 * Displays a list of plates that are in the ont selected store
 * Contains tabs to switch between list of selected plates and list of selected requests
 */
export default {
  name: 'OntPlateSelectedList',
  components: {
    Plate,
    VueSelecto,
  },
  data() {
    return {
      // The tabular fields to display for each plate request
      requestFields: [
        { key: 'id', label: 'id' },
        { key: 'sample_name', label: 'Sample name' },
        { key: 'source_identifier', label: 'Source identifier' },
        { key: 'data_type', label: 'Data type' },
        { key: 'library_type', label: 'Library type' },
        { key: 'number_of_flowcells', label: 'Number of flowcells' },
      ],
      sourceIndex: 0,
      tabTitles: ['Plates', 'Requests'],
    }
  },
  computed: {
    ...mapGetters(['selectedPlates', 'wellList', 'requestList']),
    // A method to determine which requests are selected from plates
    selectedPlateRequests() {
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
        this.selectWellRequests(el.__vueParentComponent.attrs.id)
      })
      e.removed.forEach((el) => {
        this.selectWellRequests(el.__vueParentComponent.attrs.id)
      })
    },
    setSource(indx) {
      this.sourceIndex = indx
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';
.wrapper {
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.wrapper > div {
  width: 50%;
}
</style>
