<template>
  <DataFetcher :fetcher="setRequests">
    <FilterCard :fetcher="setRequests" :filter-options="filterOptions" />
    <div class="flex mt-2 mb-4 border" />
    <div class="flex flex-col">
      <div class="clearfix">
        <PrinterModal
          ref="printerModal"
          class="float-left"
          :disabled="selected.length === 0"
          @selectPrinter="printLabels($event)"
        >
        </PrinterModal>

        <PacbioLibraryCreate
          ref="libraryCreateBtn"
          :selected-sample="selected[0]"
          :disabled="selected.length === 0"
          class="float-left"
          @alert="showAlert"
        >
        </PacbioLibraryCreate>

        <traction-pagination
          v-model="currentPage"
          class="float-right"
          :total-rows="requests.length"
          :per-page="perPage"
          aria-controls="samples-table"
          @input="onPageChange($event)"
        >
        </traction-pagination>
      </div>

      <traction-table
        id="samples-table"
        primary_key="id"
        :items="tableData"
        :fields="fields"
        :sort-by.sync="sortBy"
        selectable
        select-mode="single"
        @filtered="onFiltered"
        @row-selected="onRowSelected"
      >
        <template #cell(selected)="{ selected }">
          <template v-if="selected">
            <span>&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span>&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>

        <template #cell(actions)="row">
          <PacbioSampleMetadataEdit ref="sampleMetadata" :req="row.item" @alert="showAlert">
          </PacbioSampleMetadataEdit>
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
    </div>
  </DataFetcher>
</template>

<script>
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate'
import PacbioSampleMetadataEdit from '@/components/pacbio/PacbioSampleMetadataEdit'
import PrinterModal from '@/components/PrinterModal'
import FilterCard from '@/components/FilterCard'
import DataFetcher from '@/components/DataFetcher'
import TableHelper from '@/mixins/TableHelper'
import { getCurrentDate } from '@/lib/DateHelpers'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PacbioSampleIndex',
  components: {
    PacbioLibraryCreate,
    PrinterModal,
    PacbioSampleMetadataEdit,
    FilterCard,
    DataFetcher,
  },
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'selected', label: '\u2713' },
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'sample_name', label: 'Name', sortable: true },
        { key: 'sample_species', label: 'Species', sortable: true },
        { key: 'source_identifier', label: 'Source', sortable: true },
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
      filteredItems: [],
      selected: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 25,
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/requests', ['requests']),
  },
  watch: {
    requests(newValue) {
      this.setInitialData(newValue, this.perPage, { sortBy: 'created_at' })
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
      const { success, message = {} } = await this.createPrintJob({
        printerName,
        labels: this.createLabels(),
        copies: 1,
      })

      this.showAlert(message, success ? 'success' : 'danger')
    },

    ...mapActions('traction/pacbio/requests', ['setRequests']),
    ...mapActions('printMyBarcode', ['createPrintJob']),
  },
}
</script>
