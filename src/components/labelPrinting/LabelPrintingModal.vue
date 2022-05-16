<template>
  <div>
    <b-modal
      id="labelPrintingModal"
      ref="labelPrintingModal"
      size="sm"
      title="Print Labels"
      :static="isStatic"
      @ok="sendPrintRequest"
    >
      <h3>List of barcodes to be printed:</h3>
      <ul id="list-barcodes-to-print">
        <li v-for="(item, index) in barcodesList" :key="index + 1">{{ item }}</li>
      </ul>
      <h3 id="title">Printer: {{ printerName }}</h3>
      <h3 id="copies">Copies: {{ copies }}</h3>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LabelPrintingModal',
  props: {
    disabled: Boolean,
    isStatic: Boolean,
    barcodesList: {
      type: Array,
      default() {
        return []
      },
    },
    printerName: {
      type: String,
      default() {
        return ''
      },
    },
    copies: {
      type: String,
      default() {
        return ''
      },
    },
  },
  methods: {
    async sendPrintRequest() {
      const params = {
        printerName: this.printerName,
        barcodesList: this.barcodesList,
        copies: this.copies,
      }
      let printJobV2Response = await this.printJobV2(params)
      this.showAlert(
        printJobV2Response.data.message,
        printJobV2Response.success ? 'success' : 'danger',
      )
    },
    ...mapActions('printMyBarcode', ['printJobV2']),
  },
}
</script>
