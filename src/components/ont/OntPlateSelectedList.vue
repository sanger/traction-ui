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
              @click="ontPoolCreateStore.deselectPlateAndContents(plate.id)"
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

<script setup>
/**
 * # OntTagSetList
 *
 * Displays a list of tagSets to select from for ont pooling
 */
import Plate from '@/components/ont/OntPlateItem.vue'
import { VueSelecto } from 'vue3-selecto'
import { ref, computed } from 'vue'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const ontPoolCreateStore = useOntPoolCreateStore()

// The tabular fields to display for each plate request
const requestFields = [
  { key: 'id', label: 'ID' },
  { key: 'sample_name', label: 'Sample Name' },
  { key: 'source_identifier', label: 'Source Identifier' },
  { key: 'data_type', label: 'Data Type' },
  { key: 'library_type', label: 'Library Type' },
  { key: 'number_of_flowcells', label: 'Number of Flowcells' },
]

const sourceIndex = ref(0)

const tabTitles = ref(['Plates', 'Requests'])

/**
 * Computes a flat list of all requests associated with the currently selected plates.
 *
 * @returns {Array} An array of request objects, each corresponding to a request found in the wells of the selected plates.
 *
 * @description
 * This computed property iterates over all selected plates, then for each plate:
 * - Retrieves the wells associated with the plate using the store's `wellList` getter.
 * - For each well, retrieves the requests using the store's `requestList` getter.
 * - Flattens all requests into a single array.
 * This is used to display all requests related to the currently selected plates in the UI.
 */
const selectedPlateRequests = computed(() => {
  const val = ontPoolCreateStore.selectedPlates
    .flatMap((plate) => {
      return ontPoolCreateStore.wellList(plate.wells).flatMap((well) => {
        return ontPoolCreateStore.requestList(well.requests || [])
      })
    })
    .filter((request) => request.id !== undefined && request.id !== null)
  return val
})

const requestClicked = ({ id, selected }) => {
  ontPoolCreateStore.selectRequest(id, !selected)
}

const selectedPlates = computed(() => ontPoolCreateStore.selectedPlates)

/**
 * Handles selection events from VueSelecto.
 *
 * @param {Object} e - The event object from VueSelecto, containing `added` and `removed` elements.
 *
 * @description
 * For each element added or removed by the selection, this function calls the store's `selectWellRequests`
 * action with the element's ID. This updates the selection state of wells in the store based on user interaction.
 */
const onSelect = (e) => {
  e.added.forEach((el) => {
    ontPoolCreateStore.selectWellRequests(el.getAttribute('id'))
  })
  e.removed.forEach((el) => {
    ontPoolCreateStore.selectWellRequests(el.getAttribute('id'))
  })
}

const setSource = (index) => {
  sourceIndex.value = index
}
</script>
