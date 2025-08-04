<template>
  <DataFetcher :fetcher="fetchRuns">
    <FilterCard :fetcher="fetchRuns" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-button id="newRun" class="float-left" theme="create" @click="redirectToRun()">
          New Run
        </traction-button>
        <traction-pagination class="float-right" aria-controls="run-index"></traction-pagination>
      </div>

      <traction-table id="run-index" v-model:sort-by="sortBy" :items="runs" :fields="fields">
        <template #cell(actions)="row">
          <traction-button
            :id="generateId('editRun', row.item.id)"
            theme="edit"
            size="sm"
            class="mr-1"
            @click="redirectToRun(row.item.id)"
            >Edit</traction-button
          >
          <a
            :id="generateId('sample-sheet', row.item.id)"
            :href="generateSampleSheetPath(row.item.id)"
            class="text-primary p-1 mr-1 whitespace-nowrap"
          >
            <traction-button
              :id="generateId('generate-sample-sheet', row.item.id)"
              class="bg-sp-400 hover:bg-sp-300"
            >
              Sample Sheet <DownloadIcon class="pl-1" />
            </traction-button>
          </a>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
/**
 * ONTRunIndex view
 * Displays a table of ONT runs with filtering, sorting, and actions.
 * Uses Pinia store for state and actions.
 */
import DataFetcher from '@/components/DataFetcher.vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import FilterCard from '@/components/FilterCard.vue'
import useQueryParams from '@/composables/useQueryParams.js'
import useOntRunsStore from '@/stores/ontRuns.js'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const { fetchWithQueryParams } = useQueryParams()
const ontRunsStore = useOntRunsStore()
const router = useRouter()

const fields = [
  { key: 'id', label: 'Run ID', sortable: true },
  {
    key: 'experiment_name',
    label: 'Experiment ID',
    sortable: true,
    tdClass: 'experiment-name',
  },
  { key: 'state', label: 'State', sortable: true },
  {
    key: 'instrument_name',
    label: 'Instrument Name',
    sortable: true,
    tdClass: 'instrument-name',
  },
  {
    key: 'rebasecalling_process',
    label: 'Modified Basecalling Required',
    sortable: true,
    tdClass: 'instrument-name',
  },
  { key: 'created_at', label: 'Created at (UTC)', sortable: true },
  { key: 'actions', label: 'Actions', tdClass: 'actions' },
]

const filterOptions = [
  { value: '', text: '' },
  { value: 'experiment_name', text: 'Experiment ID' },
  { value: 'state', text: 'State' },
  // Add more filters as needed
]

const sortBy = ref('created_at')

const runs = computed(() => ontRunsStore.runs)

function generateId(text, id) {
  return `${text}-${id}`
}

function generateSampleSheetPath(id) {
  return import.meta.env.VITE_TRACTION_BASE_URL + `/v1/ont/runs/${id}/sample_sheet`
}

function redirectToRun(runId) {
  router.push({ path: `/ont/run/${runId || 'new'}` })
}

async function fetchRuns() {
  return await fetchWithQueryParams(ontRunsStore.fetchOntRuns, filterOptions)
}
</script>

<style></style>
