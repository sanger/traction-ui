<template>
  <DataFetcher :fetcher="provider">
    <FilterCard :fetcher="provider" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination class="float-right" aria-controls="pool-index"> </traction-pagination>
      </div>

      <traction-table
        id="pool-index"
        v-model:sort-by="sortBy"
        :items="displayedPools"
        :fields="fields"
        selectable
        select-mode="multi"
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

        <template #cell(actions)="row">
          <router-link
            data-action="edit-pool"
            :to="{ name: 'ONTPoolCreate', params: { id: row.item.id } }"
          >
            <traction-button :id="'editPool-' + row.item.id" size="sm" theme="edit"
              >Edit</traction-button
            >
          </router-link>
        </template>

        <template #cell(show_details)="row">
          <traction-button
            :id="'details-btn-' + row.item.id"
            size="sm"
            class="mr-2"
            theme="default"
            @click="row.toggleDetails"
          >
            {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
          </traction-button>
        </template>

        <template #row-details="row">
          <div>
            <traction-table :items="row.item.libraries" :fields="field_in_details">
            </traction-table>
          </div>
        </template>

        <template #cell(source_identifier)="row">
          <traction-tooltip
            v-if="row.item.source_identifier.split(',').length > 4"
            :tooltip-text="row.item.source_identifier"
            :tooltip-direction="'top-[25px] left-0'"
            :tooltip-wrap="'text-wrap'"
          >
            <p>{{ formattedSourceIdentifier(row.item.source_identifier) }}</p>
          </traction-tooltip>
        </template>
      </traction-table>

      <div class="clearfix">
        <printerModal
          ref="printerModal"
          class="float-left"
          :disabled="selected.length === 0"
          @select-printer="printLabels($event)"
        >
        </printerModal>
      </div>
    </div>
  </DataFetcher>
</template>

<script setup>
/**
 * ONTPoolIndex - Pool index and selection logic for ONT pipeline
 * Migrated to Vue 3 <script setup> Composition API
 * @module ONTPoolIndex
 */
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import PrinterModal from '@/components/labelPrinting/PrinterModal.vue'
import { ref, computed } from 'vue'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import useQueryParams from '@/composables/useQueryParams.js'
import { usePrintingStore } from '@/stores/printing.js'
import useLocationFetcher from '@/composables/useLocationFetcher.js'
import { locationBuilder } from '@/services/labwhere/helpers.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
import useAlert from '@/composables/useAlert.js'

// --- Reactive State ---
const fields = [
  { key: 'selected', label: '\u2713' },
  { key: 'id', label: 'Pool ID', sortable: true },
  { key: 'tube_barcode', label: 'Barcode', sortable: true },
  { key: 'source_identifier', label: 'Source', sortable: true },
  { key: 'volume', label: 'Volume', sortable: true },
  { key: 'concentration', label: 'Concentration', sortable: true },
  { key: 'kit_barcode', label: 'Kit Barcode', sortable: true },
  { key: 'insert_size', label: 'Insert Size', sortable: true },
  { key: 'final_library_amount', label: 'Final Library Amount', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'created_at', label: 'Created at (UTC)', sortable: true },
  { key: 'actions', label: 'Actions' },
  { key: 'show_details', label: '' },
]
const field_in_details = [
  { key: 'sample_name', label: 'Sample(s)' },
  { key: 'group_id', label: 'Tag(s)' },
]
const filterOptions = [
  { value: '', text: '' },
  { value: 'id', text: 'Pool ID' },
  { value: 'barcode', text: 'Barcode' },
  { value: 'sample_name', text: 'Sample Name' },
  // Need to specify filters in json api resources if we want more filters
]
const selected = ref([])
const sortBy = ref('created_at')
const labwareLocations = ref([])
const { showAlert } = useAlert()

// --- Store and composables ---
const ontPoolCreateStore = useOntPoolCreateStore()
const { fetchWithQueryParams } = useQueryParams()
const { fetchLocations } = useLocationFetcher()
const printingStore = usePrintingStore()

// --- Getters ---
const displayedPools = computed(() =>
  locationBuilder(ontPoolCreateStore.pools, labwareLocations.value),
)

// --- Methods ---
/**
 * Create the labels needed for the print job
 * @returns {Array<Object>} Array of label objects
 */
function createLabels() {
  const date = getCurrentDate()
  return selected.value.map(({ barcode, source_identifier }) => ({
    barcode,
    first_line: 'Ont - Pool',
    second_line: date,
    third_line: barcode,
    fourth_line: source_identifier,
    label_name: 'main_label',
  }))
}

/**
 * Creates the print job and shows a success or failure alert
 * @param {String} printerName The name of the printer to send the print job to
 */
async function printLabels(printerName) {
  const { success, message = {} } = await printingStore.createPrintJob({
    printerName,
    labels: createLabels(),
    copies: 1,
  })
  // showAlert should be defined/injected in the parent or globally
  if (typeof showAlert === 'function') {
    showAlert(message, success ? 'success' : 'danger')
  } else {
    // fallback: log to console
    console.log('Print job result:', message, success)
  }
}

/**
 * Format source identifier for display
 * @param {String} sourceIdentifier
 * @returns {String}
 */
function formattedSourceIdentifier(sourceIdentifier) {
  if (!sourceIdentifier) return ''
  const sources = sourceIdentifier.split(',')
  if (sources.length < 5) return sourceIdentifier
  return `${sources[0]}  ...   ${sources[sources.length - 1]}`
}

/*Fetches the pools from the api and adds location data
  @returns {Object} { success: Boolean, errors: Array }*/
const provider = async () => {
  const { success, errors } = await fetchWithQueryParams(
    ontPoolCreateStore.fetchOntPools,
    filterOptions,
  )
  // We only want to fetch labware locations if the requests were fetched successfully
  if (success) {
    // We don't need to fail if labware locations can't be fetched, so we don't return anything
    const barcodes = ontPoolCreateStore.pools.map(({ tube_barcode }) => tube_barcode)
    labwareLocations.value = await fetchLocations(barcodes)
  }

  return { success, errors }
}
</script>
