<template>
  <flagged-feature name="flexible_pooling">
    <template #default>
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
                >
                </traction-select>
              </div>
              <div class="flex flex-col w-full">
                <div class="flex flex-row w-full justify-between">
                  <label class="flex text-left whitespace-nowrap" for="csvFileInput"
                    >Pooling CSV</label
                  >
                  <div class="flex flex-row items-center">
                    <traction-tooltip
                      id="csv-tooltip"
                      class="text-sp-600 text-left"
                      tooltip-bg-colour="bg-sp-200"
                    >
                      <template #tooltip>
                        <!-- Tool tip content > -->
                      </template>
                      <TractionInfoIcon :size="20" />
                    </traction-tooltip>
                    <div class="whitespace-nowrap">
                      <a
                        data-testid="flexible-pooling-template"
                        href="/flexible-pooling-template.csv"
                        download="FlexiblePoolingTemplate.csv"
                        class="text-sp-600 hover:underline text-sm"
                      >
                        Download CSV template
                      </a>
                    </div>
                  </div>
                </div>
                <div id="borderDiv" class="w-full">
                  <input
                    data-testid="csv-file-input"
                    class="block rounded border file:border-0 w-full my-2"
                    type="file"
                    accept="text/csv, .csv"
                  />
                </div>
              </div>
            </div>
          </traction-section>
          <traction-section title="Pooling" number="2">
            <LabwareMap v-slot="{ position }" :labware-type="LabwareTypes.Plate96">
              <FlexiblePoolWell :position="position" />
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
                :disabled="busy"
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
import { ref } from 'vue'
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import LabwareMap from '@/components/labware/LabwareMap.vue'
import FlexiblePoolWell from '@/components/labware/FlexiblePoolWell.vue'
import { LabwareTypes } from '@/lib/LabwareTypes'
import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import useAlert from '@/composables/useAlert.js'

// Composables and stores
const multiPoolCreateStore = useMultiPoolCreateStore()
const { showAlert } = useAlert()

// Props
const props = defineProps({
  // Router param for the multi pool ID
  id: {
    type: [String, Number],
    default: 0,
  },
})

// State
const poolingLayoutOptions = [{ text: 'Plate', value: 'Plate' }]
const pipelineOptions = [{ text: 'Pacbio', value: 'pacbio' }]
// Flag to indicate if the form is busy processing a request
const busy = ref(false)

// Actions

/**
 * Creates the multi pool using the multi pool create store
 */
const create = () => {
  busy.value = true
  multiPoolCreateStore.createMultiPool().then(({ success, barcode, errors }) => {
    success
      ? showAlert(`Flexible pool successfully created with barcode ${barcode}`, 'success')
      : showAlert(errors, 'danger')
    busy.value = false
  })
}

/**
 * Resets the multi pool create store data and sets default values
 */
const reset = () => {
  multiPoolCreateStore.clearData()
}

/**
 * Clears the multi pool data, and sets the multi pool
 * @returns {Promise<Object>} A promise that resolves with an object containing a success property set to true.
 */
const provider = async () => {
  await multiPoolCreateStore.setMultiPool({ id: props.id })
  return { success: true }
}
</script>
