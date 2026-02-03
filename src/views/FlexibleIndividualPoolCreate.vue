<template>
  <flagged-feature name="flexible_pooling">
    <div
      class="flex flex-row items-center gap-2 p-2 mt-4 mb-4 whitespace-nowrap border border-gray-200 bg-gray-100 gap-y-4 shadow-sm"
    >
      <router-link
        data-testid="backToMultiPool"
        :to="{ name: 'FlexiblePool', params: { id: getRouteId() } }"
        class="text-gray-700"
      >
        <TractionArrowIcon class="inline-block h-4 w-4" />
        <span class="align-middle whitespace-nowrap underline underline-offset-2 font-bold"
          >Back to multi pool</span
        >
      </router-link>
    </div>
    <div class="border border-gray-200 p-4 shadow-md">
      <div class="flex flex-col">
        <div class="w-full grid grid-cols-2 gap-x-2 mt-4">
          <div class="flex flex-col">
            <traction-section
              title="Scan labware"
              number="1a"
              description="To get started, please scan or type a plate or tube barcode, then press Enter or click the Search button"
            >
              <div class="flex flex-row items-center">
                <BarcodeIcon class="w-8 h-8" />
                <div class="flex flex-row w-full space-x-2">
                  <traction-input
                    id="labware-finder-input"
                    ref="searchRef"
                    v-model="searchText"
                    type="search"
                    placeholder="Type to search"
                    label="Search value"
                    class="w-full"
                    @enter-key-press="search"
                  />
                  <traction-button
                    id="labware-finder-button"
                    :disabled="searchText == ''"
                    @click="search(searchText)"
                  >
                    Search
                  </traction-button>
                </div>
              </div>
            </traction-section>
          </div>

          <div>
            <PacbioTagSetList ref="tagSetList" />
            <PacbioTagSetItem />
          </div>
          <div>
            <PacbioLabwareSelectedList
              :labware="scannedLabware"
              :highlight="aliquotSelectionHighlightLabware"
              @closed="onClosed"
            />
          </div>
          <div>
            <!-- The "Create Pool" button is part of this component! -->
            <PacbioPoolEdit :flexible-pool="true" @aliquot-selected="handleAliquotSelection" />
          </div>
        </div>
      </div>
    </div>
  </flagged-feature>
</template>

<script setup>
import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList.vue'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList.vue'
import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem.vue'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit.vue'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'
import TractionButton from '@/components/shared/TractionButton.vue'
import useAlert from '@/composables/useAlert.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const { showAlert } = useAlert()
const route = useRoute()
const pacbioPoolCreateStore = usePacbioPoolCreateStore()

/**
 * Array of objects with barcode and type
 * @type {Array}
 * @example [{ barcode: 'DN1234', type: 'plates' }, { barcode: 'DN1235', type: 'tubes' }]
 */
const scannedLabware = ref([])
/**
 * The search text
 * @type {String}
 * @example 'DN1234'
 */
const searchText = ref('')
/**
 * The search input ref
 */
const searchRef = ref(null)

const aliquotSelectionHighlightLabware = ref(null)

const getRouteId = () => {
  return route.params.id
}

/**
 * Called when the labware is closed
 */
const onClosed = (labware) => {
  labware.type === 'plates'
    ? pacbioPoolCreateStore.deselectPlateAndContents(labware.id)
    : pacbioPoolCreateStore.deselectTubeAndContents(labware.id)
  scannedLabware.value = scannedLabware.value.filter((item) => item.barcode !== labware.barcode)
}
/**
 * Searches for the labware
 */
const search = async (value) => {
  // Check if the labware is already scanned
  if (scannedLabware.value.find((item) => item.barcode === value)) {
    showAlert('Labware already scanned', 'danger')
    return
  }
  // Check if the labware is a plate or tube
  const findPlate = await pacbioPoolCreateStore.findPacbioPlate({ barcode: value })
  if (!findPlate.success) {
    const findTube = await pacbioPoolCreateStore.findPacbioTube({ barcode: value })
    if (!findTube.success) {
      showAlert('No labware found', 'danger')
      return
    }
  }
  // Add the labware to the scanned labware array
  scannedLabware.value.push({ barcode: value, type: findPlate.success ? 'plates' : 'tubes' })
  searchText.value = ''
}

const handleAliquotSelection = (aliquot) => {
  if (!aliquot) {
    aliquotSelectionHighlightLabware.value = null
    return
  }
  let labware = pacbioPoolCreateStore.selectedTubes.find(
    (tube) =>
      aliquot.source_type === 'Pacbio::Request'
        ? tube.requests[0] === aliquot.source_id //this is a sample tube
        : tube.source_id === aliquot.source_id, //this is a library tube
  )
  if (!labware) {
    labware = pacbioPoolCreateStore.selectedPlates.find((plate) =>
      Object.values(pacbioPoolCreateStore.resources.wells).some(
        (well) => well.requests[0] === aliquot.source_id && well.plate === plate.id,
      ),
    )
  }
  aliquotSelectionHighlightLabware.value = { labware, aliquot }
}
</script>
