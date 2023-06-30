<template>
  <DataFetcher :fetcher="setLibraries">
    <FilterCard :fetcher="setLibraries" :filter-options="filterOptions" />
    <div class="flex mt-2 mb-4 border" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-button
          id="deleteLibraries"
          theme="delete"
          class="float-left"
          :disabled="selected.length === 0"
          @click="handleLibraryDelete"
        >
          Delete Libraries
        </traction-button>
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
          :total-rows="libraries.length"
          :per-page="perPage"
          aria-controls="library-index"
          @input="onPageChange($event)"
        />
      </div>

      <traction-table
        id="library-index"
        :items="tableData"
        :fields="fields"
        :sort-by.sync="sortBy"
        selectable
        select-mode="multi"
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
          <traction-button
            :id="`editPool-${row.item.pool?.id}`"
            size="sm"
            theme="edit"
            :to="{ name: 'PacbioPoolCreate', params: { id: row.item.pool.id } }"
            >Edit</traction-button
          >
        </template>
      </traction-table>
    </div>
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
  name: 'PacbioLibraryIndex',
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
        { key: 'pool.id', label: 'pool ID', sortable: true },
        { key: 'id', label: 'Library ID', sortable: true },
        {
          key: 'run_suitability.ready_for_run',
          label: 'Ready',
          formatter: (obj) => (obj['run_suitability.ready_for_run'] ? '✓' : ''),
          sortable: true,
        },
        { key: 'sample_name', label: 'Sample Name', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'source_identifier', label: 'Source', sortable: true },
        { key: 'volume', label: 'Volume', sortable: true },
        { key: 'concentration', label: 'Concentration', sortable: true },
        {
          key: 'template_prep_kit_box_barcode',
          label: 'Template Prep Kit Box Barcode',
          sortable: true,
        },
        { key: 'insert_size', label: 'Insert Size', sortable: true },
        { key: 'tag_group_id', label: 'Tag', sortable: true },
        { key: 'created_at', label: 'Created at (UTC)', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      filterOptions: [
        { value: '', text: '' },
        { value: 'barcode', text: 'Barcode', wildcard: true },
        { value: 'sample_name', text: 'Sample Name' },
        { value: 'source_identifier', text: 'Source' },
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
    ...mapGetters('traction/pacbio/libraries', ['libraries']),
  },
  watch: {
    libraries(newValue) {
      this.setInitialData(newValue, this.perPage)
    },
  },
  methods: {
    async handleLibraryDelete() {
      try {
        const selectedIds = this.selected.map((s) => s.id)
        const responses = await this.deleteLibraries(selectedIds)

        if (responses.every((r) => r.successful)) {
          const keyword = selectedIds.length > 1 ? 'Libraries' : 'Library'
          this.showAlert(`${keyword} ${selectedIds.join(', ')} successfully deleted`, 'success')
          // Refetch the updated libraries
          try {
            await this.setLibraries()
          } catch (error) {
            this.showAlert('Failed to get libraries: ' + error.message, 'danger')
          }
        } else {
          throw Error(responses.map((r) => r.errors.message).join(','))
        }
      } catch (error) {
        this.showAlert('Failed to delete: ' + error.message, 'danger')
      }
    },
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
          first_line: 'Pacbio - Library',
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
    ...mapActions('traction/pacbio/libraries', ['deleteLibraries', 'setLibraries']),
    ...mapActions('printMyBarcode', ['createPrintJob']),
  },
}
</script>
