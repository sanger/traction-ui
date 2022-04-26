<template>
  <div>
    <b-modal
      id="labelPrintingModal"
      ref="labelPrintingModal"
      size="sm"
      title="Print Labels"
      :static="isStatic"
      @ok="handleOk"
      @shown="clearSelect"
    >
      <b-list-group>
        <b-list-group-item>Barcodes:</b-list-group-item>
        <b-list-group-item v-for="(item, index) in listBarcodes" :key="index + 1">{{ item }}</b-list-group-item>
      </b-list-group>
    </b-modal>
    <b-btn id="printLabels" v-b-modal.labelPrintingModal variant="primary" :disabled="disabled">
        Print Labels
      </b-btn>
  </div>
</template>

<script>
// const MESSAGE_PRINTER_SELECT = 'Please select a printer'
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
  },
  data() {
    return {
      // selectedPrinterId: null,
      // printerOptions: [],
    }
  },
  // created() {
  //   this.provider()
  // },
  methods: {
    clearSelect() {
      // this.selectedPrinterId = null
    },
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault()

      // if (!this.selectedPrinterId) {
      //   alert(MESSAGE_PRINTER_SELECT)
      // } else {
      //   this.handleSubmit()
      // }
    },
    handleSubmit() {
      // OR store holds key id and text value - emit id then store handles get name
      let printerName = this.printerOptions[this.selectedPrinterId].text
      this.$emit('selectPrinter', printerName)
      this.clearSelect()
      /**
       * Hide the modal manually
       * https://vuejsdevelopers.com/2019/01/22/vue-what-is-next-tick/
       * https://bootstrap-vue.js.org/docs/components/modal/#prevent-closing
       */
      this.$nextTick(() => {
        this.$refs.labelPrinterModal.hide()
      })
    },
    // setPrinterNames() {
    //   let printerOptions = this.$store.getters.printers.map((printer, index) => ({
    //     value: index + 1,
    //     text: printer,
    //   }))
    //   printerOptions.unshift({ value: null, text: MESSAGE_PRINTER_SELECT })
    //   this.printerOptions = printerOptions
    // },
    // provider() {
    //   this.setPrinterNames()
    // },
  },
}
</script>
