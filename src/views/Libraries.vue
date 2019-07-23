<template>
  <div class="libraries">
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

    <b-button id="deleteLibraries" @click="handleLibraryDelete" :disabled="this.selected.length === 0" class="float-right">Delete Libraries</b-button>
    <printerModal @selectPrinter="handlePrintLabel" :disabled="this.selected.length === 0"></printerModal>
  </div>
</template>

<script>
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import printJob from '@/api/PrintJobRequests'

export default {
  name: 'Libraries',
  mixins: [Api],
  props: {
    items: Array
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Library ID', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'sample_name', label: 'Sample Name', sortable: true },
        { key: 'enzyme_name', label: 'Enzyme Name', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'deactivated_at', label: 'Deactivated at', sortable: true },
      ],
      selected: [],
      message: ''
    }
  },
  components: {
    Alert,
    PrinterModal
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
    async handleLibraryDelete () {
      try {
        await this.deleteLibraries()
      } catch (err) {
        this.message = 'Failed to delete: ' + err
        this.showAlert()
      }
    },
    async deleteLibraries () {
      let selectedIds = this.selected.map(s => s.id)
      let promises = this.libraryRequest.destroy(selectedIds)
      let responses = await Promise.all(promises.map(promise => handlePromise(promise)))

      if (responses.every(r => r.successful)) {
        this.message = `Libraries ${selectedIds.join(',')} successfully deleted`
        this.showAlert()
      } else {
        throw responses.map(r => r.errors.message).join(',')
      }
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  computed: {
    libraryRequest () {
      return this.api.traction.saphyr.libraries
    },
    getItems () {
      return this.items.map(i => Object.assign(i.material, {barcode: i.barcode}))
    }
  }
}

</script>
