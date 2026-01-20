<template>
  <flagged-feature name="flexible_pooling">
    <template #default>
      <DataFetcher :fetcher="provider">
        <div
          class="w-full max-w-6xl mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4 space-y-4"
        >
          <traction-heading level="2" show-border>Flexible pooling</traction-heading>
          <traction-section title="Setup" number="1">
            <div class="flex flex-row gap-x-8 w-full">
              <div class="text-left w-full">
                <span>Pipeline</span>
                <traction-select
                  v-model="pipeline"
                  data-testid="pipeline-select"
                  class="w-full py-1"
                  :options="pipelineOptions"
                >
                </traction-select>
              </div>
              <div class="text-left w-full">
                <span>Pooling layout</span>
                <traction-select
                  v-model="poolingLayout"
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
              <traction-button data-testid="create-btn" theme="create"
                >Create Flexible Pool</traction-button
              >
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

// Composables and stores
const multiPoolCreateStore = useMultiPoolCreateStore()

// Props
const props = defineProps({
  // Router param for the multi pool ID
  id: {
    type: [String, Number],
    default: 0,
  },
})

// State
const poolingLayout = ref('Plate')
const poolingLayoutOptions = [{ text: 'Plate', value: 'Plate' }]
const pipeline = ref('Pacbio')
const pipelineOptions = [{ text: 'Pacbio', value: 'Pacbio' }]

// Actions

/**
 * Resets the multi pool create store data and sets default values
 */
const reset = () => {
  multiPoolCreateStore.clearData()
  poolingLayout.value = 'Plate'
  pipeline.value = 'Pacbio'
}

/**
 * Clears the multi pool data, and sets the multi pool
 * @returns {Promise<Object>} A promise that resolves with an object containing a success property set to true.
 */
const provider = async () => {
  reset()
  await multiPoolCreateStore.setMultiPool({ id: props.id })
  return { success: true }
}
</script>
