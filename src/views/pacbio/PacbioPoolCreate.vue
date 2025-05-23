<template>
  <!-- The data fetcher key is used to re-render the page if a user goes from an existing pool to a new one -->
  <data-fetcher :key="route.fullPath" :fetcher="fetchPoolsData">
    <div class="flex flex-col pt-4">
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
          <PacbioPoolEdit @aliquot-selected="handleAliquotSelection" />
        </div>
      </div>
    </div>
  </data-fetcher>
</template>

<script setup>
/**
 * @name PacbioPoolCreate
 * @description The Pacbio pool create view
 * This view is used to create the page to createa a new pool or edit an existing pool
 */
import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList.vue'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList.vue'
import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem.vue'
import PacbioPoolEdit from '@/components/pacbio/PacbioPoolEdit.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'
import useAlert from '@/composables/useAlert.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

//composables
const { showAlert } = useAlert()
const pacbioPoolCreateStore = usePacbioPoolCreateStore()
const pacbioRootStore = usePacbioRootStore()
const route = useRoute()

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

/**
 * Fetches the pools data
 * @returns {Promise<{ success: Boolean, errors: Array }>
 */
const fetchPoolsData = async () => {
  resetData()
  // Fetch the tag sets
  const { success, errors } = await pacbioRootStore.fetchPacbioTagSets()
  if (!success) {
    showAlert(errors, 'danger')
  }
  // Fetch the pool data if it is for editing an existing pool
  if (route.params.id !== 'new') {
    //Populate the used aliquots from the pool
    const { success, errors } = await pacbioPoolCreateStore.populateUsedAliquotsFromPool(
      route.params.id,
    )
    //If used aliquots are populated, set the scanned labware appropriately which is used to display the
    if (success) {
      pacbioPoolCreateStore.selectedPlates.map((plate) => {
        scannedLabware.value.push({ barcode: plate.barcode, type: 'plates' })
      })
      pacbioPoolCreateStore.selectedTubes.map((tube) => {
        scannedLabware.value.push({ barcode: tube.barcode, type: 'tubes' })
      })
    }
    return { success, errors }
  } else {
    return { success: true, errors: [] }
  }
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

/**
 * Resets the data of the page. Required for users navigating to pools new from an existing pool
 * @returns {void}
 */
const resetData = () => {
  // Reset local variables and inputs
  scannedLabware.value = []
  searchText.value = ''
  searchRef.value = null
  aliquotSelectionHighlightLabware.value = null

  // Reset pool store data
  pacbioPoolCreateStore.clearPoolData()
}
</script>
