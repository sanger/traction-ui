<template>
  <flagged-feature name="flexible_pooling">
    <template #default>
      <loading-full-screen-modal v-bind="loadingModalState"></loading-full-screen-modal>
      <DataFetcher :fetcher="provider">
        <div
          class="w-full max-w-6xl mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4 space-y-4"
        >
          <traction-heading level="2" show-border>Flexible pooling</traction-heading>
          <div class="flex flex-col text-left gap-y-2">
            <span
              >Make multiple pools simultaneously by uploading a CSV file or manually creating pools
              in the below <b>Pooling</b> section.</span
            >
            <span>
              Pools will not be saved until you click the <b>Create Flexible Pool</b> button in the
              <b>Actions</b> section.
            </span>
            <div class="flex flex-row gap-x-2 items-center text-sp-600">
              <TractionInfoIcon :size="20" />
              <span
                >This page is persisted on refresh, please use the <b>Reset</b> button in the
                <b>Actions</b> section if you wish to reset the page.</span
              >
            </div>
          </div>
          <traction-section title="Setup" number="1">
            <div class="flex flex-row gap-x-8 w-full">
              <div class="text-left w-full">
                <span>Pipeline</span>
                <traction-select
                  v-model="multiPoolCreateStore.multiPool.pipeline"
                  data-testid="pipeline-select"
                  class="w-full py-1"
                  :options="pipelineOptions"
                  :disabled="isSetupDisabled"
                >
                </traction-select>
              </div>
              <div class="text-left w-full">
                <span>Pooling layout</span>
                <traction-select
                  v-model="multiPoolCreateStore.multiPool.pool_method"
                  data-testid="pooling-layout-select"
                  class="w-full py-1"
                  :options="poolingLayoutOptions"
                  :disabled="isSetupDisabled"
                >
                </traction-select>
              </div>
              <div class="flex flex-col w-full">
                <div class="flex flex-row w-full justify-between">
                  <div class="flex flex-row">
                    <label class="flex text-left whitespace-nowrap" for="csvFileInput"
                      >Pooling CSV</label
                    >
                    <div class="flex flex-row items-center">
                      <traction-tooltip
                        id="csv-tooltip"
                        class="text-sp-600 text-left"
                        tooltip-bg-colour="bg-sp-200"
                        tooltip-direction="top-[25px] right-0"
                      >
                        <template #tooltip>
                          <div class="w-full">
                            <h1 class="px-2 font-semibold text-lg text-sp-600">CSV Guidelines</h1>
                            <ul class="w-full list-disc list-inside p-2 space-y-2">
                              <li>
                                All columns must contain values: <br />
                                <div class="px-4 font-bold">
                                  Pool Number,Source Identifier,Tag Set,Tag,Template Prep Kit Box
                                  Barcode,Volume (uL),Concentration (ng/uL),Insert Size
                                </div>
                              </li>
                              <li>
                                <strong>Pool Number:</strong> Samples with the same pool number will
                                be grouped into the same pool.
                              </li>
                              <li>
                                <strong>Source Identifier:</strong> Library source, Tube barcode, or
                                combination of Plate barcode and Well position.
                              </li>
                              <li>
                                <strong>Tag Set:</strong> The tag set name of tags to be used.
                              </li>
                              <li><strong>Tag:</strong> The tag to apply to the sample.</li>
                              <li>
                                <strong>Template Prep Kit Box Barcode:</strong> The barcode of the
                                template prep kit.
                              </li>
                              <li>
                                <strong>Volume (uL):</strong> The volume of the sample in
                                microliters.
                              </li>
                              <li>
                                <strong>Concentration (ng/uL):</strong> The concentration of the
                                sample in nanograms per microliter.
                              </li>
                              <li><strong>Insert Size:</strong> The insert size for the sample.</li>
                            </ul>
                          </div>
                        </template>
                        <TractionInfoIcon :size="20" />
                      </traction-tooltip>
                    </div>
                  </div>
                  <div class="whitespace-nowrap">
                    <a
                      data-testid="flexible-pooling-template"
                      href="/flexible-pooling-template.csv"
                      download="FlexiblePoolingTemplate.csv"
                      class="text-sp-600 hover:underline text-sm flex flex-row items-center"
                    >
                      CSV template <DownloadIcon color="#b95c7d" />
                    </a>
                  </div>
                </div>
                <div id="borderDiv" class="w-full">
                  <input
                    ref="csv-file-input"
                    data-testid="csv-file-input"
                    class="block rounded border file:border-0 w-full my-2"
                    type="file"
                    accept="text/csv, .csv"
                    :disabled="isSetupDisabled"
                    @change="uploadFile"
                  />
                </div>
              </div>
            </div>
          </traction-section>
          <traction-section title="Pooling" number="2">
            <LabwareMap v-slot="{ position }" :labware-type="labwareType">
              <FlexiblePoolWell :id="route.params.id" :position="position" />
            </LabwareMap>
          </traction-section>
          <traction-section title="Actions" number="3">
            <div class="w-full flex justify-between">
              <traction-button data-testid="reset-btn" theme="delete" @click="reset"
                >Reset</traction-button
              >
              <traction-button
                data-testid="create-btn"
                theme="create"
                :disabled="busy || !multiPoolCreateStore.isValidMultiPool()"
                @click="create"
              >
                <span class="button-text">Create Flexible Pool</span>
                <traction-spinner v-show="busy"></traction-spinner>
              </traction-button>
            </div>
          </traction-section>
        </div>
      </DataFetcher>
    </template>
    <template #disabled>
      <div>This content is not available.</div>
    </template>
  </flagged-feature>
</template>

<!--
  Flexible pool create page
  This page allows users to create or edit flexible pools.
-->
<script setup>
import { ref, computed, watch, useTemplateRef } from 'vue'
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import LabwareMap from '@/components/labware/LabwareMap.vue'
import FlexiblePoolWell from '@/components/labware/FlexiblePoolWell.vue'
import { LabwareTypes } from '@/lib/LabwareTypes'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate'
import useAlert from '@/composables/useAlert.js'
import { useRoute, useRouter } from 'vue-router'
import DownloadIcon from '@/icons/DownloadIcon.vue'

// Composables and stores
const multiPoolCreateStore = useMultiPoolCreateStore()
const pacbioPoolCreateStore = usePacbioPoolCreateStore()
const { showAlert } = useAlert()
const route = useRoute()
const router = useRouter()

// refs
const csvInput = useTemplateRef('csv-file-input')

// State
const id = computed(() => route.params.id)
const poolingLayoutOptions = [
  { text: 'Plate', value: 'Plate' },
  { text: 'Tube Rack', value: 'TubeRack' },
]
const pipelineOptions = [{ text: 'Pacbio', value: 'pacbio' }]
// Flag to indicate if the form is busy processing a request
const busy = ref(false)
const loadingModalState = ref({ visible: false, message: '' })

// Actions
// Watch for changes to the route id and call provider
watch(
  () => id.value,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await provider()
    }
  },
)

/**
 * Creates the multi pool using the multi pool create store
 */
const create = () => {
  busy.value = true
  multiPoolCreateStore.createMultiPool().then(({ success, id, errors }) => {
    success
      ? showAlert(`Flexible pool successfully created with id ${id}`, 'success')
      : showAlert(errors, 'danger')
    reset()
    resetPacbio()
    busy.value = false
    if (id && success) {
      router.push({ name: 'FlexiblePool', params: { id } })
    }
  })
}

/**
 * Handles the csv file upload
 * @param evt - Event object
 */
const uploadFile = async (evt) => {
  showLoadingModal('Processing CSV file...')
  if (evt?.target?.files?.length) {
    const { success, errors } = await multiPoolCreateStore.parsePoolingCsvFile(evt.target.files[0])
    if (success) {
      showAlert('CSV file successfully processed', 'success')
    } else {
      showAlert(errors.join(', '), 'danger')
    }
  } else {
    showAlert('No file selected. Please select a CSV file to upload.', 'warning')
  }
  clearLoadingModal()
}

/**
 * Hides the loading modal and resets the loading modal state to default values
 */
function clearLoadingModal() {
  loadingModalState.value = { visible: false, message: '' }
}

/**
 * Shows the loading modal with the provided message
 */
function showLoadingModal(message) {
  loadingModalState.value = { visible: true, message }
}

/**
 * Resets the multi pool create store data and sets default values
 */
const reset = () => {
  // Clear the CSV file input
  if (csvInput) {
    csvInput.value.value = null
  }

  multiPoolCreateStore.clearData()
}

/**
 * Resets the pool create store data and sets default values
 */
const resetPacbio = () => {
  pacbioPoolCreateStore.clearPoolData()
}

/**
 * Clears the multi pool data, and sets the multi pool
 * @returns {Promise<Object>} A promise that resolves with an object containing a success property set to true.
 */
const provider = async () => {
  await multiPoolCreateStore.setMultiPool({ id: id.value })
  return { success: true }
}

/**
 * Dynamically determines the labware type based on the selected pooling layout.
 * If the user selects 'Tube Rack', it returns the TubeRack24 configuration from LabwareTypes.
 * Otherwise, it defaults to the MultiPool96 configuration.
 *
 * @returns {Object} The labware type configuration object (TubeRack24 or MultiPool96).
 */
const labwareType = computed(() => {
  return multiPoolCreateStore.multiPool.pool_method === 'TubeRack'
    ? LabwareTypes.TubeRack24
    : LabwareTypes.MultiPool96
})
/**
 * Dynamically determines if the setup section should be disabled.
 * If the user starts creating pools (i.e. multiPoolPositions has length greater than 0),
 * the section will be disabled to prevent changes.
 *
 * @returns {boolean} A boolean value indicating whether the setup section should be disabled.
 */
const isSetupDisabled = computed(() => {
  const positions = multiPoolCreateStore?.multiPool?.multiPoolPositions
  if (!positions || typeof positions !== 'object') return false
  return Object.keys(positions).length > 0
})
</script>
