<template>
  <div>
    <traction-form-group
      label="Filter"
      label-cols-sm="1"
      label-align-sm="right"
      label-for="filterInput"
      class="mb-0"
    >
      <traction-input-group>
        <traction-input
          id="filterInput"
          v-model="filter"
          type="search"
          placeholder="Type to Search"
        >
        </traction-input>
        <traction-input-group-append>
          <traction-button :disabled="!filter" @click="filter = ''">Clear</traction-button>
        </traction-input-group-append>
      </traction-input-group>
    </traction-form-group>
    <br />

    <traction-table
      id="libraries-table"
      ref="libraries_table"
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
      :busy.sync="isBusy"
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
    </traction-table>

    <span class="font-weight-bold">Total records: {{ libraries.length }}</span>

    <div class="clearfix">
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @selectPrinter="printLabels($event)"
      >
      </printerModal>

      <traction-button
        id="deleteLibraries"
        theme="delete"
        class="float-left"
        :disabled="selected.length === 0"
        @click="handleLibraryDelete"
      >
        Delete Libraries
      </traction-button>

      <traction-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="libraries.length"
        :per-page="perPage"
        aria-controls="libraries-table"
        @input="onPageChange($event)"
      >
      </traction-pagination>
    </div>
    <traction-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <traction-input id="input-per-page" v-model="perPage" trim class="w-25"></traction-input>
    </traction-form-group>
  </div>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import PrinterModal from '@/components/PrinterModal'
import { mapActions, mapGetters } from 'vuex'
import { getCurrentDate } from '@/lib/DateHelpers'

export default {
  name: 'SaphyrLibraries',
  components: {
    PrinterModal,
  },
  mixins: [TableHelper],
  props: {
    pipeline: {
      type: String,
      default: 'saphyr',
    },
  },
  data() {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Library ID', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'sample_name', label: 'Sample Name', sortable: true },
        { key: 'enzyme_name', label: 'Enzyme Name', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
      ],
      items: [],
      filteredItems: [],
      selected: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 6,
      currentPage: 1,
      preFilteredMaterials: [],
      isBusy: false,
    }
  },
  computed: {
    ...mapGetters('traction/saphyr/tubes', ['libraries']),
  },
  watch: {
    libraries(newValue) {
      this.setInitialData(newValue, this.perPage)
    },
  },
  created() {
    // When this component is created (the 'created' lifecycle hook is called), we need to get the
    // items for the table
    this.provider()
  },
  methods: {
    async handleLibraryDelete() {
      try {
        const selectedIds = this.selected.map((s) => s.id)
        const selectedBarcodes = this.selected.map((s) => s.barcode)
        const responses = await this.deleteLibraries(selectedIds)

        if (responses.every((r) => r.successful)) {
          const keyword = selectedIds.length > 1 ? 'Libraries' : 'Library'
          this.showAlert(
            `${keyword} ${selectedBarcodes.join(', ')} successfully deleted`,
            'success',
          )
          this.provider()
        } else {
          throw Error(responses.map((r) => r.errors.message).join(','))
        }
      } catch (error) {
        this.showAlert('Failed to delete: ' + error.message, 'danger')
      }
    },
    // Get all the libraries
    // Provider function used by the bootstrap-vue table component
    async provider() {
      await this.setLibraries()
    },
    /*
      create the labels needed for the print job
      each label will be in the format { first_line: pipeline - type, second_line: current date, third_line: barcode, fourth_line: source, label_name: }
      @returns {Array[{Object}, {Object} ...]}
    */
    createLabels() {
      const date = getCurrentDate()
      return this.selected.map(({ barcode }) => {
        return {
          barcode,
          first_line: 'Saphyr - Library',
          second_line: date,
          third_line: barcode,
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
    ...mapActions('traction/saphyr/tubes', ['deleteLibraries', 'setLibraries']),
    ...mapActions('printMyBarcode', ['createPrintJob']),
  },
}
</script>
