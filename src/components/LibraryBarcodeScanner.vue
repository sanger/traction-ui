<template>
  <div class="libraryBarcodeScanner">
    <b-form-input id="libraryBarcodeScanner" v-model="libraryBarcode" type="text" placeholder="Library Barcode Scanner" @change="updateLibraryBarcode"/>
  </div>
</template>

<script>
import Api from '@/api'
import store from '@/store/index'

export default {
  name: 'LibraryBarcodeScanner',
  props: {
    flowcell: Object
  },
  data () {
    return {
      libraryBarcode: this.flowcell.library.barcode,
      message: ''
    }
  },
  methods: {
    async updateLibraryBarcode() {
      if (this.libraryBarcode.split('\n').length > 1) {
        this.message = 'You can only have one library in a flowcell'
        this.showAlert
        return
      }
      let library = await this.getLibraryFromBarcode()

      if (Object.keys(library).length !== 0) {
        let libraryId = library.id
        let flowcellId = this.flowcell.id
        await this.updateFlowcellInTraction(flowcellId, libraryId)
      }
    },
    async getLibraryFromBarcode() {
      let rawResponse = await this.tubeRequest.get()
      let response = new Api.Response(rawResponse).deserialize.tubes

      // assuming there is only one material with the tubes barcode
      var library = {}
      if (response === undefined) {
        this.message = 'This library does not exist'
        this.showAlert
      } else if (response[0].material.type !== 'libraries') {
        this.message = 'This barcode does not contain a library'
        this.showAlert
      } else {
        library = response[0].material
      }
      return library
    },
    async updateFlowcellInTraction(flowcellId, libraryId) {
      let requestBody = { data: { type: 'flowcells', id: flowcellId, attributes: { library_id: libraryId }} }

      let rawResponse = await this.flowcellsRequest.update(requestBody)
      let response = new Api.Response(rawResponse[0])

      if (Object.keys(response.errors).length === 0) {
        this.message = 'Library added to flowcell'
        this.showAlert

      } else {
        this.message = response.errors.message
      }
    }
  },
  computed: {
    tubeRequest () {
      // use of filter updated in Steves refactor but may no currently work until merged
      return store.getters.traction.tubes
    },
    flowcellsRequest () {
      return store.getters.traction.flowcells
    },
    showAlert () {
      return this.$emit('alert', this.message)
    }
  }
}
</script>
