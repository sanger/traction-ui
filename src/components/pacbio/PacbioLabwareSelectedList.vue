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
    <traction-section number="1b" title="Select samples" :description="sectionTitle">
      <template v-if="selectedLabware.length > 0">
        <div class="flex space-x-2 py-4 border-gray-100 mb-2">
          <label class="text-base">Table view</label>
          <traction-toggle v-model="tableView" data-attribute="table-check-box" />
        </div>

        <div v-if="!tableView" class="flex flex-wrap overflow-y-auto">
          <div
            v-for="item in selectedLabware"
            :key="item.id"
            data-type="selected-labware-item"
            class="w-1/2"
          >
            <div
              :class="[
                'border border-sdb bg-blue-100 rounded-lg p-1 mr-3 mt-2',
                `${item.barcode === props.highlight?.labware.barcode && 'border-2 border-blue-600'}`,
              ]"
            >
              <div class="flex w-full justify-end">
                <button
                  :id="'remove-btn-' + item.id"
                  class="p-1 bg-blue-100 hover:bg-gray-800 hover:text-white"
                  @click="onClose(item)"
                >
                  <traction-close-icon />
                </button>
              </div>
              <Plate v-if="isPlate(item)" ref="plate" v-bind="item"></Plate>
              <PacbioTubeWell v-else :requests="getTubeRequest(item)" @click="requestClicked" />
              <span data-attribute="labware-name" class="flex font-medium text-gray-500"
                >{{ item.barcode }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col" data-attribute="table-view">
          <div class="flex w-full justify-end space-x-2 p-2">
            <label>Sort by selection</label>
            <input
              v-model="sortBySelection"
              type="checkbox"
              class="text-base"
              data-attribute="sort-by-selection"
            />
          </div>
          <div class="overflow-y-auto h-screen">
            <traction-table
              :items="selectedRequests"
              :fields="state.requestFields"
              :tbodyTrClass="tableRowColour"
              @row-clicked="requestClicked"
              ><template #cell(actions)="row">
                <div class="flex flex-row justify-center">
                  <input
                    :id="'add-request' + row.item.id"
                    :checked="row.item.selected"
                    type="checkbox"
                    :data-attribute="'request-checkbox-' + row.item.id"
                    @change="requestClicked({ id: row.item.id, selected: row.item.selected })"
                  />
                </div> </template
            ></traction-table>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex justify-center items-center mx-auto h-96">
          <label data-attribute="warning-label">Please scan labware to view the samples</label>
        </div>
      </template>
    </traction-section>
  </div>
</template>

<script setup>
/**
 * @name PacbioLabwareSelectedList
 * @description Renders a list of selected labware with the ability to select requests
 * The component can be used to display selected plates, tubes and libraries as well display the requests associated with them in a table view
 * @param {Array} labware - An array of labware objects
 * @emits closed - Emits the labware object when the close button is clicked
 */
import Plate from '@/components/pacbio/PacbioPlateItem.vue'
import PacbioTubeWell from '@/components/labware/PacbioTubeWell.vue'
import { VueSelecto } from 'vue3-selecto'
import { computed } from 'vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import { ref, reactive } from 'vue'

const props = defineProps({
  /**
   * The labware to display
   * @type {Array}
   * @default []
   * @example [{ barcode: 'DN1234', type: 'plates' }, { barcode: 'DN1235', type: 'tubes' }]
   */
  labware: {
    type: Array,
    required: true,
    default: () => [],
  },
  highlight: {
    type: Object,
    required: false,
    default: undefined,
  },
})
/**
 * @property {Array} requestFields - The fields to display in the table view
 */
const state = reactive({
  requestFields: [
    { key: 'source_identifier', label: 'Source Identifier' },
    { key: 'sample_species', label: 'Sample species' },
    { key: 'library_type', label: 'Library type' },
    { key: 'number_of_smrt_cells', label: 'Number of smrt cells' },
    { key: 'estimate_of_gb_required', label: 'Estimate of gb required' },
    { key: 'actions', label: '+/-' },
  ],
})
//Refs
const tableView = ref(false) // A ref for table view state which decides whether to display the table view or not
const sortBySelection = ref(false) // A ref for sort by selection state which decides whether to sort the requests by selection or not

const emit = defineEmits(['closed']) // Defines an emit function that emits a 'closed' event.

//Composables
const pacbioPoolCreateStore = usePacbioPoolCreateStore() // A composable store for the pacbio pool create store

/**
 * A computed property that returns all selected requests
 * If the sortBySelection value is true, the requests are sorted by selection
 * @returns {Array} - An array of selected requests which can be sorted by selection
 */
const selectedRequests = computed(() => {
  //get all selected requests first in the order of the labware scanned
  const requests = props.labware.flatMap((labware) => {
    if (isPlate(labware)) {
      const plate = pacbioPoolCreateStore.selectedPlates.find(
        (item) => item.barcode === labware.barcode,
      )
      return pacbioPoolCreateStore
        .wellList(plate.wells)
        .flatMap((well) => pacbioPoolCreateStore.requestList(well.requests || []))
    } else {
      const tube = pacbioPoolCreateStore.selectedTubes.find(
        (item) => item.barcode === labware.barcode,
      )
      return pacbioPoolCreateStore.requestList(tube.requests || [])
    }
  })
  //sort requests by selection if sortBySelection is true
  return sortBySelection.value ? requests.sort((a, b) => b.selected - a.selected) : requests
})

/**
 * A computed property that returns all selected labware
 * @returns {Array} - An array of selected labware in the order they were scanned
 */
const selectedLabware = computed(() => {
  return props.labware.map((labware) => {
    const searchArray = isPlate(labware)
      ? pacbioPoolCreateStore.selectedPlates
      : pacbioPoolCreateStore.selectedTubes
    return searchArray.find((item) => item.barcode === labware.barcode)
  })
})

/*
 * A computed property that returns the section title
 * If no labware is selected, the title is an empty string
 * If the table view is selected, the title is 'Click either on the checkbox or directly on the rows to select samples'
 * If the table view is not selected, the title is 'Click on wells (in plates) or tubes to select samples'
 */
const sectionTitle = computed(() => {
  if (selectedLabware.value.length === 0) {
    return ''
  }
  return tableView.value
    ? 'Click either on the checkbox or directly on the rows to select samples'
    : 'Click on wells (in plates) or tubes to select samples'
})

/**
 * A method that checks if the labware is a plate
 * @param {Object} labware - The labware object
 * @returns {Boolean} - A boolean value indicating if the labware is a plate
 */
const isPlate = (labware) => {
  return labware.type === 'plates'
}

/**
 * A method that returns the requests associated with a tube
 * @param {Object} tube - The tube object
 * @returns {Array} - An array of requests associated with the tube
 */
const getTubeRequest = (tube) => pacbioPoolCreateStore.requestList(tube.requests || [])

/**
 * A method that handles the request clicked event
 * @param {Object} request - The request object
 */
const requestClicked = ({ id, selected }) =>
  pacbioPoolCreateStore.selectRequest({ id, selected: !selected })
const onClose = (labware) => {
  emit('closed', labware)
}

/**
 * A method that handles the table row background color
 * @param {Object} row - The row object
 * @returns {String} - A string representing the background color of the row based on the selection state
 * The background color is yellow if the row is selected and gray if it is not selected
 */
const tableRowColour = (row) => {
  return `${row.selected ? 'bg-yellow-300' : 'bg-gray-200'} ${
    row.id === props.highlight?.request.id && 'border-2 border-blue-600'
  } cursor-pointer`
}

/**
 * A method that handles the select event
 * @param {Object} e - The event object
 */
const onSelect = (e) => {
  e.added.forEach((el) => {
    pacbioPoolCreateStore.selectWellRequests(el.getAttribute('id'))
  })
  e.removed.forEach((el) => {
    pacbioPoolCreateStore.selectWellRequests(el.getAttribute('id'))
  })
}
</script>
