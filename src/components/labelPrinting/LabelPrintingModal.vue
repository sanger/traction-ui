<template>
  <div>
    <b-btn id="printLabels" v-b-modal.labelPrintingModal variant="primary" :disabled="disabled"
      >Print Labels</b-btn
    >

    <b-modal
      id="labelPrintingModal"
      ref="labelPrintingModal"
      size="sm"
      title="Print Labels"
      :static="isStatic"
      @ok="sendPrintRequest"
    >
      <h3>List of barcodes to be printed:</h3>
      <hr />
      <ul id="list-barcodes-to-print">
        <li v-for="(item, index) in barcodesList" :key="index + 1">{{ item }}</li>
      </ul>
      <hr />
      <h3 id="title">Printer: {{ printer.text }}</h3>
      <h3 id="copies">Copies: {{ copies }}</h3>
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LabelPrintingModal',
  props: {
    barcodesList: {
      type: Array,
      default() {
        return []
      },
    },
    printer: {
      type: Object,
      default() {
        return {}
      },
    },
    copies: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      disabled: Boolean,
      isStatic: Boolean,
    }
  },
  methods: {
    async sendPrintRequest() {
      try {
        const params = {
          printer: this.printer,
          barcodesList: this.barcodesList,
          copies: this.copies,
        }
        let printJobV2Response = await this.printJobV2(params)

        if (!printJobV2Response.success) {
          throw { message: printJobV2Response.errors }
        }

        this.showAlert('Successful print request: ' + printJobV2Response.data.message, 'success')
      } catch (error) {
        this.showAlert('Print request failed: ' + error.message, 'danger')
      }
    },
    ...mapActions('printMyBarcode', ['printJobV2']),
  },
}
</script>
