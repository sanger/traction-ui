<template>
  <DataFetcher :fetcher="provider">
    <FilterCard :fetcher="provider" :filter-options="filterOptions" />
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

        <template #cell(edit)="row">
          <traction-button
            :data-action="'edit-request-' + row.item.id"
            size="sm"
            class="mr-2"
            :theme="row.detailsShowing ? 'paginationDefault' : 'default'"
            @click="row.toggleDetails"
          >
            {{ row.detailsShowing ? 'Cancel edit' : 'Edit' }}
          </traction-button>
        </template>
        <template #row-details="row">
          <OntRequestEdit :id="row.item.id" @edit-completed="row.toggleDetails()" />
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
import { ref, computed } from 'vue'
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import useQueryParams from '@/composables/useQueryParams.js'
import useLocationFetcher from '@/composables/useLocationFetcher.js'
import { formatRequests } from '@/lib/requestHelpers.js'
import { useOntRequestsStore } from '@/stores/ontRequests.js'
import OntRequestEdit from '@/components/ont/OntRequestEdit.vue'

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
  { key: 'edit', label: '' },
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
const ontRequestsStore = useOntRequestsStore()
const { fetchWithQueryParams } = useQueryParams()
const { fetchLocations } = useLocationFetcher()

// --- Getters ---
const displayedRequests = computed(() => formatRequests(ontRequestsStore.requests, labwareLocations.value))

/*Fetches the requests from the api and adds location data
  @returns {Object} { success: Boolean, errors: Array }*/
const provider = async () => {
  const { success, errors } =  await fetchWithQueryParams(ontRequestsStore.fetchRequests, filterOptions)
  // We only want to fetch labware locations if the requests were fetched successfully
  if (success) {
    // We don't need to fail if labware locations can't be fetched, so we don't return anything
    const requestArray = ontRequestsStore.requests
    const sources = requestArray.map(({ source_identifier }) => source_identifier)
    labwareLocations.value = await fetchLocations(sources)
  }
  
  return { success, errors }
}
</script>
