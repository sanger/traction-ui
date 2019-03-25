<template>
  <div class="libraryBarcodeScanner">
    <b-form-input id="libraryBarcodeScanner" v-model="libraryBarcode" type="text" placeholder="Library Barcode Scanner" @change="updateLibraryBarcode"/>
  </div>
</template>

<script>
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/api'

export default {
  name: 'LibraryBarcodeScanner',
  mixins: [Api],
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
      let promise = this.tubeRequest.get({filter: { barcode: this.queryString} })
      let response = await handlePromise(promise)

      var library = {}
      if (response.successful) {
        // assuming there is only one material with the tubes barcode
        if (response.deserialize.tubes[0].material.type !== 'libraries') {
          this.message = 'This barcode does not contain a library'
          this.showAlert
        } else {
          library = response.deserialize.tubes[0].material
        }
      } else {
        this.message = 'This library does not exist'
        this.showAlert
      }
      return library
    },
    async updateFlowcellInTraction(flowcellId, libraryId) {
      let requestBody = { data: { type: 'flowcells', id: flowcellId, attributes: { library_id: libraryId }} }

      let promises = this.flowcellsRequest.update(requestBody)
      let response = await handlePromise(promises[0])

      if (response.successful) {
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
      return this.api.traction.tubes
    },
    flowcellsRequest () {
      return this.api.traction.flowcells
    },
    showAlert () {
      return this.$emit('alert', this.message)
    },
    queryString () {
      return this.libraryBarcode.replace('\n','')
    }
  }
}
</script>
