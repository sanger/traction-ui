<template>
  <DataFetcher :fetcher="fetchRequests">
    <FilterCard :fetcher="fetchRequests" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination
          class="float-right"
          aria-controls="samples-table"
        ></traction-pagination>
      </div>

      <traction-table
        id="samples-table"
        v-model:sort-by="sortBy"
        :items="displayedRequests"
        :fields="fields"
        selectable
        select-mode="single"
        @row-selected="(items) => (selected = items)"
      >
        <template #cell(selected)="selectedCell">
          <template v-if="selectedCell.selected">
            <span>&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span>&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import useQueryParams from '@/composables/useQueryParams.js'
import useLocationFetcher from '@/composables/useLocationFetcher.js'
import { formatRequests } from '@/lib/requestHelpers.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

// --- Reactive State ---
const fields = [
  { key: 'selected', label: '\u2713' },
  { key: 'id', label: 'Sample ID (Request)', sortable: true },
  { key: 'source_identifier', label: 'Source', sortable: true },
  { key: 'sample_name', label: 'Sample Name', sortable: true },
  { key: 'library_type', label: 'Library type' },
  { key: 'data_type', label: 'Data type' },
  { key: 'number_of_flowcells', label: 'Number of flowcells' },
  { key: 'cost_code', label: 'Cost code' },
  { key: 'external_study_id', label: 'External study ID' },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'sample_retention_instruction', label: 'Retention Instruction', sortable: true },
  { key: 'created_at', label: 'Created at (UTC)', sortable: true },
]
const filterOptions = [
  { value: '', text: '' },
  { value: 'id', text: 'Sample ID (Request)' },
  { value: 'source_identifier', text: 'Source barcode' },
  { value: 'sample_name', text: 'Sample name' },
  // Need to specify filters in json api resources if we want more filters
]
const selected = ref([])
const sortBy = ref('created_at')
const labwareLocations = ref([])

// --- Store and composables ---
const ontPoolCreateStore = useOntPoolCreateStore()
const { fetchWithQueryParams } = useQueryParams()
const { fetchLocations } = useLocationFetcher()

// --- Getters ---
const requests = computed(() => ontPoolCreateStore.requests)
const barcodes = computed(() => requests.value.map(({ source_identifier }) => source_identifier))
const displayedRequests = computed(() => formatRequests(requests.value, labwareLocations.value))

// --- Watchers ---
watch(
  barcodes,
  async (newBarcodes) => {
    labwareLocations.value = await fetchLocations(newBarcodes)
  },
  { immediate: true },
)

// --- Methods ---
const fetchOntRequests = (...args) => ontPoolCreateStore.fetchOntRequests(...args)

async function fetchRequests() {
  return await fetchWithQueryParams(fetchOntRequests, filterOptions)
}
</script>
