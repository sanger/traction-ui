<template>

  <div class="modal">
    <b-btn id="printLabels" :disabled="disabled" v-b-modal.printerModal>Print Labels</b-btn>
    <b-modal id="printerModal" title="Print Labels" ref="printerModal" @ok="handleOk" @shown="clearSelect">
      <b-form-select v-model="selectedPrinterId" :options="printerOptions" class="mb-3" />
    </b-modal>
  </div>

</template>

<script>

export default {
  name: 'PrinterModal',
  data () {
    return {
      selectedPrinterId: null,
      printerOptions: []
    }
  },
  props: {
    disabled: Boolean,
  },
  methods: {
    clearSelect () {
      this.selectedPrinterId = null
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()

      if (!this.selectedPrinterId) {
        alert('Please select an printer')
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit () {
      // OR store holds key id and text value - emit id then store handles get name
      let printerName = this.printerOptions[this.selectedPrinterId].text
      this.$emit('selectPrinter', printerName)
      this.clearSelect()
      this.$refs.printerModal.hide()
    },
    setPrinterNames () {
      let printerOptions = this.$store.getters.printers.map(
        (printer, index) => Object.assign({ value: index+1, text: printer })
      )
      printerOptions.unshift({ value: null, text: "Please select an printer" })
      this.printerOptions = printerOptions
    },
    provider () {
      this.setPrinterNames()
    }
  },
  created () {
    this.provider()
  }
}
</script>

<style>

.modal {
  display: inline;
  position: relative;
}

</style>
