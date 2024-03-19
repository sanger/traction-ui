<template>
  <data-fetcher :fetcher="fetchPoolsData">
    <div class="flex flex-col pt-4">
      <div class="w-full grid grid-cols-2 gap-x-2 mt-4">
        <div class="flex flex-col">
          <traction-section
            title="Scan labware"
            number="1a"
            description="To get started, scan or type a plate, tube, or library barcode and press Enter"
          >
            <div class="flex flex-row space-x-2 items-center">
              <BarcodeIcon class="w-8 h-8" />
              <traction-input
                id="labware-finder-input"
                ref="searchRef"
                v-model="searchText"
                type="search"
                placeholder="Type barcode and press enter"
                label="Search value"
                class="w-full"
                @enterKeyPress="search"
              />
            </div>
          </traction-section>
        </div>

        <div>
          <PacbioTagSetList ref="tagSetList" />
          <PacbioTagSetItem />
        </div>
        <div>
          <PacbioLabwareSelectedList :labware="scannedLabware" @closed="onClosed" />
        </div>
        <div>
          <PacbioPoolEdit />
        </div>
      </div>
    </div>
  </data-fetcher>
</template>

<script setup>
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

//Composables
const { showAlert } = useAlert()
const pacbioPoolCreateStore = usePacbioPoolCreateStore()
const pacbioRootStore = usePacbioRootStore()
const route = useRoute()

const scannedLabware = ref([])
const searchText = ref('')
const searchRef = ref(null)

const fetchPoolsData = async () => {
  pacbioPoolCreateStore.clearPoolData()
  const { success, errors } = await pacbioRootStore.fetchPacbioTagSets()
  if (!success) {
    showAlert(errors, 'danger')
  }

  // We should come up with a better solution to identify 'new' pools
  // Currently if the route is anything other than 'new' we assume its a pool id
  // However that is not always the case, maybe we could check the type as well.
  if (route.params.id !== 'new') {
    const { success, errors } = await pacbioPoolCreateStore.populateUsedAliquotsFromPool(
      route.params.id,
    )
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

const onClosed = (labware) => {
  labware.type === 'plates'
    ? pacbioPoolCreateStore.deselectPlateAndContents(labware.id)
    : pacbioPoolCreateStore.deselectTubeAndContents(labware.id)
  scannedLabware.value = scannedLabware.value.filter((item) => item.barcode !== labware.barcode)
}
const search = async (value) => {
  if (scannedLabware.value.find((item) => item.barcode === value)) {
    showAlert('Labware already scanned', 'danger')
    return
  }
  const findPlate = await pacbioPoolCreateStore.findPacbioPlate({ barcode: value })
  if (!findPlate.success) {
    const findTube = await pacbioPoolCreateStore.findPacbioTube({ barcode: value })
    if (!findTube.success) {
      showAlert('No labware found', 'danger')
      return
    }
  }
  scannedLabware.value.push({ barcode: value, type: findPlate.success ? 'plates' : 'tubes' })
  searchText.value = ''
}
</script>
