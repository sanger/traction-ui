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
      @ok="handleOk"
    >
      <h3>List of barcodes to be printed:</h3>
      <hr />
      <ul id="list-barcodes-to-print">
        <li v-for="(item, index) in listBarcodes" :key="index + 1">{{ item }}</li>
      </ul>
      <hr />
      <h3>Printer: {{ printerName }}</h3>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'LabelPrintingModal',
  props: {
    disabled: Boolean,
    isStatic: Boolean,
    listBarcodes: {
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
  },
  methods: {
    handleOk(event) {
      // Prevent modal from closing
      event.preventDefault()

      // TODO: validate and trigger printing
    },
    handleSubmit() {
      // TODO: how to do the printing?
      // this.$emit('selectPrinter', this.printerName)
      // this.clearSelect()
      /**
       * Hide the modal manually
       * https://vuejsdevelopers.com/2019/01/22/vue-what-is-next-tick/
       * https://bootstrap-vue.js.org/docs/components/modal/#prevent-closing
       */
      this.$nextTick(() => {
        this.$refs.labelPrinterModal.hide()
      })
    },
  },
}
</script>
