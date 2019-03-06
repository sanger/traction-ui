<template>
  <div class="libraryBarcodeScanner">
    <b-form-input id="libraryBarcodeScanner" v-model="libraryBarcode" type="text" placeholder="Library Barcode Scanner" @change="updateLibraryBarcode"/>
  </div>
</template>

<script>
import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'

export default {
  name: 'LibraryBarcodeScanner',
  mixins: [ComponentFactory],
  props: {
    flowcell: Object,
  },
  data () {
    return {
      libraryBarcode: this.flowcell.library.barcode,
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
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    tubeRequest () {
      return this.build(Api.Request, {...this.tractionConfig.resource('tubes'), filters: { barcode: this.libraryBarcode }})
    },
    flowcellsRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('flowcells'))
    },
    showAlert () {
      // console.log('ALERT')
      // console.log(this.message)
    }
  }
}
</script>
