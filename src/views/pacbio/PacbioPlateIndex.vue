<template>
  <DataFetcher :fetcher="fetchPlates">
    <FilterCard :fetcher="fetchPlates" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination class="float-right" aria-controls="plate-index"> </traction-pagination>
      </div>

      <traction-table
        id="plate-index"
        v-model:sort-by="sortBy"
        primary_key="id"
        :fields="fields"
        :items="plates"
      >
        <template #cell(show_details)="row">
          <traction-button
            :id="'details-btn-' + row.id"
            size="sm"
            theme="default"
            @click="handleTogleDetails(row)"
          >
            {{ row.detailsShowing ? 'Hide' : 'Show' }} Plate
          </traction-button>
        </template>
        <template #row-details="row">
          <Plate
            v-if="currentPlate.id == row.item.id"
            ref="plate"
            :height="row.detailsDim"
            :width="row.detailsDim"
            :plate="currentPlate"
          ></Plate>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
/**
 * PacbioPlateIndex view
 * Displays a table of Pacbio plates with filtering, sorting, and details.
 * Uses Pinia store for state and actions.
 */
import Plate from '@/components/plates/PlateItem.vue'
import FilterCard from '@/components/FilterCard.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import { ref, computed } from 'vue'
import useQueryParams from '@/composables/useQueryParams.js'
import { usePacbioPlatesStore } from '@/stores/pacbioPlates.js'

const { fetchWithQueryParams } = useQueryParams()
const store = usePacbioPlatesStore()

const fields = [
  { key: 'id', label: 'Plate ID', sortable: true },
  { key: 'barcode', label: 'Plate Barcode', sortable: true },
  { key: 'created_at', label: 'Created at (UTC)', sortable: true },
  { key: 'show_details', label: 'Show Details' },
]

const filterOptions = [
  { value: '', text: '' },
  { value: 'barcode', text: 'Barcode' },
]

const sortBy = ref('created_at')
const currentPlate = ref({})

// Plates from store
const plates = computed(() => store.getPlates)

// Toggle details for a row and fetch plate details
function handleTogleDetails(row) {
  row.toggleDetails()
  getPlate(row.item.barcode)
}

// Fetch a plate by barcode and set as currentPlate
async function getPlate(barcode) {
  currentPlate.value = await store.findPlate({ barcode })
}

// Fetch plates with query params and update store
async function fetchPlates() {
  return await fetchWithQueryParams(store.fetchPlates, filterOptions)
}
</script>
