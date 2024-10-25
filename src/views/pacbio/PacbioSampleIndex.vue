<template>
  <DataFetcher :fetcher="fetchRequests">
    <FilterCard :fetcher="fetchRequests" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div>
        <PrinterModal
          ref="printerModal"
          class="float-left"
          :disabled="selected.length === 0"
          @select-printer="printLabels($event)"
        />
        <PacbioLibraryCreate
          ref="libraryCreateBtn"
          :selected-sample="selected[0]"
          class="float-left"
        />
        <traction-pagination class="float-right" aria-controls="samples-table" />
      </div>

      <traction-table
        id="samples-table"
        v-model:sort-by="sortBy"
        primary_key="id"
        :items="requests"
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
            <template v-for="(field, index) in field_in_details">
              <span v-if="field" :key="field.label + index" class="font-weight-bold">{{
                field.label
              }}</span
              >: {{ row.item[field.item] }}
              <br v-if="field" :key="field.label" />
            </template>
          </div>
        </template>
      </traction-table>
      <LocationFetcher :barcodes="barcodes" @location-data="updateLocations" />
    </div>
  </DataFetcher>
</template>

<script>
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate.vue'
import PacbioSampleMetadataEdit from '@/components/pacbio/PacbioSampleMetadataEdit.vue'
import PrinterModal from '@/components/labelPrinting/PrinterModal.vue'
import FilterCard from '@/components/FilterCard.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import LocationFetcher from '@/components/LocationFetcher.vue'

import useQueryParams from '@/composables/useQueryParams.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'

import { mapActions, mapGetters } from 'vuex'
import { usePrintingStore } from '@/stores/printing.js'

export default {
  name: 'PacbioSampleIndex',
  components: {
    PacbioLibraryCreate,
    PrinterModal,
    PacbioSampleMetadataEdit,
    FilterCard,
    DataFetcher,
    LocationFetcher,
  },
  setup() {
    const { fetchWithQueryParams } = useQueryParams()
    return { fetchWithQueryParams }
  },
  data() {
    return {
      fields: [
        { key: 'selected', label: '\u2713' },
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'sample_name', label: 'Name', sortable: true },
        { key: 'sample_species', label: 'Species', sortable: true },
        { key: 'source_identifier', label: 'Source', sortable: true },
        { key: 'location', label: 'Location', sortable: true },
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
        // Need to specify filters in json api resources if we want more filters
      ],
      selected: [],
      sortBy: 'created_at',
      sortDesc: true,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/requests', ['requests']),
    // makes it testable. We can get rid of this when we move over to pinia.
    printingStore() {
      return usePrintingStore()
    },
    barcodes() {
      return this.requests.map((request) => request.barcode).filter(Boolean)
    },
  },
  methods: {
    /*
      create the labels needed for the print job
      each label will be in the format { first_line: pipeline - type, second_line: current date, third_line: barcode, fourth_line: source, label_name: }
      @returns {Array[{Object}, {Object} ...]}
    */
    createLabels() {
      const date = getCurrentDate()
      return this.selected.map(({ barcode, source_identifier }) => {
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
    },
    /*
      Creates the print job and shows a success or failure alert
      @param {String} printerName The name of the printer to send the print job to
    */
    async printLabels(printerName) {
      const { success, message = {} } = await this.printingStore.createPrintJob({
        printerName,
        labels: this.createLabels(),
        copies: 1,
      })

      this.showAlert(message, success ? 'success' : 'danger')
    },
    /*
      Fetches the requests from the api
      @param {Object} filter The filter to apply to the request
      @returns {Object} { success: Boolean, errors: Array }
    */
    async fetchRequests() {
      return await this.fetchWithQueryParams(this.setRequests, this.filterOptions)
    },
    async updateLocations(locationsData) {
      this.requests.forEach((request) => {
        request.location = '-'
        const location = locationsData.find((loc) => loc.barcode === request.barcode)
        if (location) {
          const { name, coordinates } = location
          request.location =
            coordinates && Object.keys(coordinates).length
              ? `${name} - ${coordinates.row}, ${coordinates.column}`
              : name
        }
      })
    },
    ...mapActions('traction/pacbio/requests', ['setRequests']),
  },
}
</script>
