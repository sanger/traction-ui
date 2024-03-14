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
        <div class="flex space-x-2 py-4 border-gray-100">
          <label class="text-base">Table view</label>
          <traction-toggle v-model="tableView" data-attribute="check-box" />
        </div>
        <div v-if="!tableView" class="flex flex-wrap overflow-y-auto space-x-2">
          <div v-for="labware in selectedLabware" :key="labware.id" data-type="selected-plate-item">
            <div class="border border-sdb py-2 bg-blue-100 rounded-lg px-2 mt-2">
              <div class="flex w-full justify-end">
                <button
                  :id="'remove-plate-btn-'"
                  class="mt-0 bg-blue-100 hover:bg-gray-300"
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
        <div v-else>
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
                  @change="requestClicked({ id: row.item.id, selected: row.item.selected })"
                />
              </div> </template
          ></traction-table>
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

const emit = defineEmits(['closed']) // Defines an emit function that emits a 'closed' event.

//Composables
const pacbioPoolCreateStore = usePacbioPoolCreateStore()

const selectedRequests = computed(() => {
  return props.labware.flatMap((labware) => {
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
  return row.selected ? 'bg-yellow-300' : 'bg-gray-400'
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
