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
        <div v-if="!tableView" class="flex flex-wrap overflo-y-auto">
          <div
            v-for="labware in selectedLabware"
            :key="labware.id"
            data-type="selected-labware-item"
            class="w-1/2"
          >
            <div class="border border-sdb bg-blue-100 rounded-lg p-1 mr-3 mt-2">
              <div class="flex w-full justify-end">
                <button
                  :id="'remove-btn-' + labware.id"
                  class="p-1 bg-blue-100 hover:bg-gray-800 hover:text-white"
                  @click="onClose(labware)"
                >
                  <traction-close-icon />
                </button>
              </div>
              <Plate v-if="isPlate(labware)" ref="plate" v-bind="labware"></Plate>
              <PacbioTubeWell v-else :requests="getTubeRequest(labware)" @click="requestClicked" />
              <span data-attribute="labware-name" class="flex font-medium text-gray-500"
                >{{ labware.barcode }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col" data-attribute="table-view">
          <div class="flex w-full justify-end space-x-2 p-2">
            <label>Sort by selection</label>
            <input v-model="sortBySelection" type="checkbox" class="text-base" data-attribute="sort-by-selection" />
          </div>
          <div class="overflow-y-auto h-screen">
            <traction-table
              :items="selectedRequests"
              :fields="state.requestFields"
              :tbodyTrClass="tableRowBackground"
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
})

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
const tableView = ref(false)
const sortBySelection = ref(false)

const emit = defineEmits(['closed']) // Defines an emit function that emits a 'closed' event.

//Composables
const pacbioPoolCreateStore = usePacbioPoolCreateStore()

const selectedRequests = computed(() => {
  //get all selected requests first
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
  return sortBySelection.value ? requests.sort((a, b) => b.selected - a.selected) : requests
})

const selectedLabware = computed(() => {
  return props.labware.map((labware) => {
    const searchArray = isPlate(labware)
      ? pacbioPoolCreateStore.selectedPlates
      : pacbioPoolCreateStore.selectedTubes
    return searchArray.find((item) => item.barcode === labware.barcode)
  })
})

const isPlate = (labware) => {
  return labware.type === 'plates'
}

const sectionTitle = computed(() => {
  if (selectedLabware.value.length === 0) {
    return ''
  }
  return tableView.value
    ? 'Click either on the checkbox or directly on the rows to select samples'
    : 'Click on wells (in plates) or libraries to select samples'
})
const getTubeRequest = (tube) => pacbioPoolCreateStore.requestList(tube.requests || [])

const requestClicked = ({ id, selected }) =>
  pacbioPoolCreateStore.selectRequest({ id, selected: !selected })
const onClose = (labware) => {
  emit('closed', labware)
}

const tableRowBackground = (row) => {
  return row.selected ? 'bg-yellow-300 cursor-pointer' : 'bg-gray-200 cursor-pointer'
}

const onSelect = (e) => {
  e.added.forEach((el) => {
    pacbioPoolCreateStore.selectWellRequests(el.getAttribute('id'))
  })
  e.removed.forEach((el) => {
    pacbioPoolCreateStore.selectWellRequests(el.getAttribute('id'))
  })
}
</script>
