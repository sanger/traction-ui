<template>
  <DataFetcher :fetcher="fetchRequests">
    <FilterCard :fetcher="fetchRequests" :filter-options="state.filterOptions" />
    <div class="flex flex-col">
      <div>
        <PrinterModal
          ref="printerModal"
          class="float-left"
          :disabled="state.selected.length === 0"
          @select-printer="printLabels($event)"
        />
        <PacbioLibraryCreate
          ref="libraryCreateBtn"
          :selected-sample="state.selected[0]"
          class="float-left"
        />
        <traction-pagination class="float-right" aria-controls="samples-table" />
      </div>

      <traction-table
        id="samples-table"
        v-model:sort-by="state.sortBy"
        primary_key="id"
        :items="formatRequests(pacbioRequestsStore.requestsArray, labwareLocations.value)"
        :fields="state.fields"
        selectable
        select-mode="single"
        @row-selected="(items) => (state.selected = items)"
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
          <PacbioSampleMetadataEdit ref="sampleMetadata" :req="row.item" @alert="showAlert" />
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
          <div class="text-left">
            <template v-for="(field, index) in state.field_in_details">
              <span v-if="field" :key="field.label + index" class="font-weight-bold">{{
                field.label
              }}</span
              >: {{ row.item[field.item] }}
              <br v-if="field" :key="field.label" />
            </template>
          </div>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate.vue'
import PacbioSampleMetadataEdit from '@/components/pacbio/PacbioSampleMetadataEdit.vue'
import PrinterModal from '@/components/labelPrinting/PrinterModal.vue'
import FilterCard from '@/components/FilterCard.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import useLocationFetcher from '@/composables/useLocationFetcher.js'

import useQueryParams from '@/composables/useQueryParams.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'

import { computed, ref, watchEffect, reactive } from 'vue'
import { usePrintingStore } from '@/stores/printing.js'
import { usePacbioRequestsStore } from '@/stores/pacbioRequests.js'
import useAlert from '@/composables/useAlert.js'
import { formatRequests } from '@/lib/requestHelpers.js'

const { fetchWithQueryParams } = useQueryParams()
const { fetchLocations } = useLocationFetcher()
const pacbioRequestsStore = usePacbioRequestsStore()
const labwareLocations = ref([])
const { showAlert } = useAlert()

const state = reactive({
  fields: [
    { key: 'selected', label: '\u2713' },
    { key: 'id', label: 'Sample ID (Request)', sortable: true },
    { key: 'sample_name', label: 'Name', sortable: true },
    { key: 'sample_species', label: 'Species', sortable: true },
    { key: 'source_identifier', label: 'Source', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'sample_retention_instruction', label: 'Retention Instruction', sortable: true },
    { key: 'created_at', label: 'Created at (UTC)', sortable: true },
    { key: 'actions', label: 'Actions' },
    { key: 'show_details', label: '' },
  ],
  field_in_details: [
    { label: 'Library type', item: 'library_type' },
    { label: 'Estimate of GB required', item: 'estimate_of_gb_required' },
    { label: 'Number of SMRT cells', item: 'number_of_smrt_cells' },
    { label: 'Cost code', item: 'cost_code' },
    { label: 'External study ID', item: 'external_study_id' },
  ],
  filterOptions: [
    { value: '', text: '' },
    { value: 'source_identifier', text: 'Source' },
    { value: 'species', text: 'Species' },
    { value: 'sample_name', text: 'Name' },
  ],
  selected: [],
  sortBy: 'created_at',
})

const printingStore = usePrintingStore()

const barcodes = computed(() => {
  return pacbioRequestsStore.requestsArray.map(({ source_identifier }) => source_identifier)
})

watchEffect(async () => {
  const barcodesValue = barcodes.value
  labwareLocations.value = await fetchLocations(barcodesValue)
})

/*create the labels needed for the print job
 each label will be in the format { first_line: pipeline - type, second_line: current date, third_line: barcode, fourth_line: source, label_name: }
@returns {Array[{Object}, {Object} ...]}
*/
const createLabels = () => {
  const date = getCurrentDate()
  return state.selected.map(({ barcode, source_identifier }) => {
    return {
      // currently don't have a barcode but not causing any harm
      barcode,
      first_line: 'Pacbio - Sample',
      second_line: date,
      third_line: barcode,
      fourth_line: source_identifier,
      label_name: 'main_label',
    }
  })
}

/*Creates the print job and shows a success or failure alert
  @param {String} printerName The name of the printer to send the print job to
*/
const printLabels = async (printerName) => {
  const { success, message = {} } = await printingStore.createPrintJob({
    printerName,
    labels: createLabels(),
    copies: 1,
  })

  showAlert(message, success ? 'success' : 'danger')
}

/*Fetches the requests from the api
  @param {Object} filter The filter to apply to the request
  @returns {Object} { success: Boolean, errors: Array }*/
const fetchRequests = async () => {
  return await fetchWithQueryParams(pacbioRequestsStore.setRequests, state.filterOptions)
}
</script>
