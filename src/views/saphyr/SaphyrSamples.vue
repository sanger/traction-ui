<template>
  <div>
    <traction-table
      id="samples-table"
      v-model:sort-by="sortBy"
      :items="requests"
      :fields="fields"
      selectable
      select-mode="single"
      @row-selected="(items) => (selected = items)"
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

    <span class="font-weight-bold">Total records: {{ requests.length }}</span>

    <div class="clearfix">
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @select-printer="printLabels($event)"
      >
      </printerModal>

      <enzymeModal
        ref="enzymeModal"
        :disabled="selected.length === 0"
        class="float-left"
        @select-enzyme="createLibraries"
      >
      </enzymeModal>
    </div>
  </div>
</template>

<script>
import EnzymeModal from '@/components/saphyr/SaphyrEnzymeModal'
import PrinterModal from '@/components/PrinterModal'
import { mapActions, mapGetters } from 'vuex'
import { getCurrentDate } from '@/lib/DateHelpers'

export default {
  name: 'SaphyrSamples',
  components: {
    EnzymeModal,
    PrinterModal,
  },
  data() {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'sample_name', label: 'Name', sortable: true },
        { key: 'sample_species', label: 'Species', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'created_at', label: 'Created at (UTC)', sortable: true },
      ],
      selected: [],
      sortBy: 'created_at',
      sortDesc: true,
    }
  },
  computed: {
    ...mapGetters('traction/saphyr/requests', ['requests']),
  },
  created() {
    this.provider()
  },
  methods: {
    async createLibraries(selectedEnzymeId) {
      const payload = { samples: this.selected, enzymeID: selectedEnzymeId }
      const response = await this.createLibrariesInTraction(payload)

      if (response.successful || !response.empty) {
        const barcodes = response.deserialize.libraries.map((l) => l.barcode)
        this.showAlert('Libraries successfully created with barcodes: ' + barcodes, 'success')
      } else {
        this.showAlert('Failed to create library in Traction: ', 'danger')
      }
    },
    async provider() {
      try {
        await this.setRequests()
      } catch (err) {
        console.error(err)
      }
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
          // currently don't have a barcode but not causing any harm
          barcode,
          first_line: 'Saphyr - Sample',
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

    ...mapActions('traction/saphyr/tubes', ['createLibrariesInTraction']),
    ...mapActions('traction/saphyr/requests', ['setRequests']),
    ...mapActions('printMyBarcode', ['createPrintJob']),
  },
}
</script>
