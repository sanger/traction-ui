<template>
  <div class="samples">
    <alert ref='alert'></alert>

    <b-table
       show-empty
       :items="tractionTubesWithInfo"
       :fields="fields"
    >
      <template slot="selected" slot-scope="row">
        <input type="checkbox" class="selected" v-model="selected" :value="row.item" />
      </template>
    </b-table>

    <modal @selectEnzyme="handleLibraryCreate" :disabled="this.selected.length === 0" class="float-right" ></modal>
    <printerModal @selectPrinter="handlePrintLabel" :disabled="this.selected.length === 0"></printerModal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import PrinterModal from '@/components/PrinterModal'
import Alert from '@/components/Alert'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/saphyr/tubes')

export default {
  name: 'Samples',
  data () {
    return {
      fields: [
        { key: 'selected', label: ''},
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'sample_name', label: 'Name', sortable: true },
        { key: 'sample_species', label: 'Species', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true }
      ],
      selected: [],
      message: ''
    }
  },
  methods: {
    async handlePrintLabel (printerName) {
      let response = await this.printLabels(printerName, this.selected)

      if (response.successful) {
        this.message = "Printed successfully"
      } else {
        this.message = response.errors.message
      }
      this.showAlert()
    },
    async handleLibraryCreate (selectedEnzymeId) {
      try {
        let payload = {'samples': this.selected, 'enzymeID': selectedEnzymeId}
        let response = await this.createLibrariesInTraction(payload)

        if (!response.successful || response.empty) {
          throw response.errors
        }

        this.handleTubeRedirect()
      } catch (error) {
        this.message = error.message
        this.showAlert()
      }
    },
    handleTubeRedirect() {
      if (!this.tractionTubes.empty) {
        if (this.tractionTubes.every(t => t.material.type == "libraries")) {
          this.$router.push({name: 'Libraries'})
        }
      } else {
        this.message = 'Failed to get Traction tubes'
        this.showAlert()
      }
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    },
    ...mapActions([
      'printLabels',
      'createLibrariesInTraction'
    ]),
  },
  components: {
    Modal,
    PrinterModal,
    Alert
  },
  computed: {
    ...mapGetters([
      'tractionTubesWithInfo',
      'tractionTubes'
    ])
  }
}

</script>
