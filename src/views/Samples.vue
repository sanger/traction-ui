<template>
  <div class="samples">
    <alert ref='alert'></alert>

    <b-table
       show-empty
       :items="getItems"
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
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'
import getTubesForBarcodes from '@/api/TubeRequests'
import Alert from '@/components/Alert'
import printJob from '@/api/PrintJobRequests'

export default {
  name: 'Samples',
  mixins: [Api],
  props: {
    items: Array
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: ''},
        { key: 'id', label: 'Sample ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'species', label: 'Species', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'deactivated_at', label: 'Deactivated at', sortable: true },
      ],
      selected: [],
      message: '',
      barcodes: ''
    }
  },
  methods: {
    async handlePrintLabel (printerName) {
      let response = await printJob(printerName, this.selected)

      if (response.successful) {
        this.message = "Printed successfully"
      } else {
        this.message = response.errors.message
      }
      this.showAlert()
    },
    async handleLibraryCreate (selectedEnzymeId) {
      try {
        await this.createLibrariesInTraction(selectedEnzymeId)
        await this.handleTractionTubes()
      } catch (err) {
        this.message = err
        this.showAlert()
      }
    },
    async createLibrariesInTraction (selectedEnzymeId) {
      let libraries = this.selected.map(item => { return {'sample_id': item.id, 'enzyme_id': selectedEnzymeId}})

      let body = { data: { type: 'libraries', attributes: { libraries: libraries }}}

      let promise = this.libraryRequest.create(body)
      let response = await handlePromise(promise)

      if (response.successful) {
        this.barcodes = response.deserialize.libraries.map(l => l.barcode).join('\n')
      } else {
        throw 'Failed to create library in Traction: ' + response.errors.message
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        throw 'There are no barcodes'
      }

      let response = await getTubesForBarcodes(this.barcodes, this.tractionTubeRequest)
      if (response.successful && !response.empty) {
        let tubes = response.deserialize.tubes
        if (tubes.every(t => t.material.type == "libraries")) {
          this.$router.push({name: 'Libraries', params: {items: tubes}})
        }
      } else {
        throw 'Failed to get Traction tubes'
      }
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  components: {
    Modal,
    PrinterModal,
    Alert
  },
  computed: {
    libraryRequest () {
      return this.api.traction.libraries
    },
    tractionTubeRequest () {
      return this.api.traction.tubes
    },
    getItems () {
      return this.items.map(i => Object.assign(i.material, {barcode: i.barcode}))
    }
  }
}
</script>
