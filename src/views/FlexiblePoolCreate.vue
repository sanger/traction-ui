<template>
  <flagged-feature name="flexible_pooling">
    <template #default>
      <div
        class="w-full max-w-6xl mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4 space-y-4"
      >
        <traction-heading level="2" show-border>Flexible pooling</traction-heading>
        <traction-section title="Setup" number="1">
          <div class="flex flex-row gap-x-8 w-full">
            <div class="text-left w-full">
              <span>Pipeline</span>
              <traction-select
                id="pipeline-select"
                v-model="pipeline"
                class="w-full py-1"
                :options="pipelineOptions"
              >
              </traction-select>
            </div>
            <div class="text-left w-full">
              <span>Pooling strategy</span>
              <traction-select
                id="pooling-strategy-select"
                v-model="poolingStrategy"
                class="w-full py-1"
                :options="poolStrategyOptions"
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
                  id="csvFileInput"
                  ref="csvFileInput"
                  class="block rounded border file:border-0 w-full my-2"
                  type="file"
                  accept="text/csv, .csv"
                  @change="onSelectFile"
                />
              </div>
            </div>
          </div>
        </traction-section>
        <traction-section title="Pooling" number="2">
          <!-- Temporary - We will need a custom well component and may need a custom labware-type and -->
          <LabwareMap v-slot="{ position }" :labware-type="LabwareTypes.Plate96">
            <PacbioRunWell :position="position" />
          </LabwareMap>
        </traction-section>
        <traction-section title="Actions" number="3">
          <div class="w-full flex justify-between">
            <traction-button theme="delete">Reset</traction-button>
            <traction-button theme="create">Create Flexible Pool</traction-button>
          </div>
        </traction-section>
      </div>
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
import LabwareMap from '@/components/labware/LabwareMap.vue'
import PacbioRunWell from '@/components/labware/PacbioRunWell.vue'
import { LabwareTypes } from '@/lib/LabwareTypes'

const poolingStrategy = ref('Plate')
const poolStrategyOptions = [{ text: 'Plate', value: 'Plate' }]
const pipeline = ref('Pacbio')
const pipelineOptions = [{ text: 'Pacbio', value: 'Pacbio' }]
</script>
