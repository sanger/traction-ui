<template>
  <DataFetcher :fetcher="setPools">
    <FilterCard :fetcher="setPools" :filter-options="filterOptions" />
    <div class="clearfix">
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @selectPrinter="printLabels($event)"
      >
      </printerModal>

      <traction-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="pools.length"
        :per-page="perPage"
        aria-controls="pool-index"
        @input="onPageChange($event)"
      >
      </traction-pagination>
    </div>

    <traction-table
      id="pool-index"
      show-empty
      responsive
      :items="tableData"
      :fields="fields"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      selectable
      select-mode="multi"
      tbody-tr-class="pool"
      @filtered="onFiltered"
      @row-selected="onRowSelected"
    >
      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
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
          id="edit-pool"
          data-action="edit-pool"
          :to="{ name: 'PacbioPoolCreate', params: { id: row.item.id } }"
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
        <traction-card>
          <traction-table
            small
            bordered
            show-empty
            :items="row.item.libraries"
            :fields="field_in_details"
            :filter="filter"
          >
          </traction-table>
          <ul v-if="!row.item.run_suitability.valid">
            <li v-for="(error, index) in row.item.run_suitability.formattedErrors" :key="index">
              {{ error }}
            </li>
          </ul>
        </traction-card>
      </template>
    </traction-table>
  </DataFetcher>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import PrinterModal from '@/components/PrinterModal'
import FilterCard from '@/components/FilterCard'
import DataFetcher from '@/components/DataFetcher'
import { mapActions, mapGetters } from 'vuex'
import { getCurrentDate } from '@/lib/DateHelpers'

export default {
  name: 'PacbioPoolIndex',
  components: {
    PrinterModal,
    FilterCard,
    DataFetcher,
  },
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'selected', label: '\u2713' },
        { key: 'id', label: 'Pool ID', sortable: true, tdClass: 'pool-id' },
        {
          key: 'run_suitability',
          label: 'Ready',
          formatter: ({ ready_for_run }) => (ready_for_run ? '✓' : ''),
          sortable: true,
        },
        { key: 'barcode', label: 'Pool Barcode', sortable: true, tdClass: 'barcode' },
        { key: 'source_identifier', label: 'Source', sortable: true, tdClass: 'source-identifier' },
        { key: 'volume', label: 'Volume', sortable: true, tdClass: 'volume' },
        { key: 'concentration', label: 'Concentration', sortable: true, tdClass: 'concentration' },
        {
          key: 'template_prep_kit_box_barcode',
          label: 'Template Prep Kit Box Barcode',
          sortable: true,
          tdClass: 'template-prep-kit-box-barcode',
        },
        { key: 'insert_size', label: 'Insert Size', sortable: true, tdClass: 'insert-size' },
        { key: 'created_at', label: 'Created at', sortable: true, tdClass: 'created-at' },
        { key: 'actions', label: 'Actions' },
        { key: 'show_details', label: '' },
      ],
      field_in_details: [
        { key: 'sample_name', label: 'Sample(s)' },
        { key: 'group_id', label: 'Tag(s)' },
      ],
      filterOptions: [
        { value: '', text: '' },
        { value: 'barcode', text: 'Pool Barcode' },
        { value: 'sample_name', text: 'Sample Name' },
        // Need to specify filters in json api resources if we want more filters
      ],
      primary_key: 'id',
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
    ...mapGetters('traction/pacbio/pools', ['pools']),
  },
  watch: {
    pools(newValue) {
      this.setInitialData(newValue, this.perPage)
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
          barcode,
          first_line: 'Pacbio - Pool',
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
    ...mapActions('traction/pacbio/pools', ['setPools']),
    ...mapActions('printMyBarcode', ['createPrintJob']),
  },
}
</script>
