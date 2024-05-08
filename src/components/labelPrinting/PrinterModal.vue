<template>
  <div>
    <traction-button id="printLabels" theme="print" :disabled="disabled" @click="onPrintAction()">
      Print Labels
    </traction-button>
    <traction-modal
      id="printerModal"
      ref="printerModal"
      size="sm"
      title="Print Labels"
      :static="isStatic"
      :visible="isShow"
      @ok="handleOk"
      @cancel="handleCancel"
      @shown="clearSelect"
    >
      <traction-select v-model="selectedPrinterId" :options="printerOptions" />
      <template #modal-footer="{ ok, cancel }">
        <traction-button size="sm" theme="accent" @click="ok()"> OK </traction-button>
        <traction-button size="sm" theme="cancel" @click="cancel()"> Cancel </traction-button>
      </template>
    </traction-modal>
  </div>
</template>

<script>
const MESSAGE_PRINTER_SELECT = 'Please select a printer'
export default {
  name: 'PrinterModal',
  props: {
    disabled: Boolean,
    isStatic: Boolean,
  },
  emits: ['selectPrinter'],
  data() {
    return {
      selectedPrinterId: null,
      printerOptions: [],
      isShow: false,
    }
  },
  created() {
    this.provider()
  },
  methods: {
    clearSelect() {
      this.selectedPrinterId = null
    },
    onPrintAction() {
      this.isShow = true
    },
    handleOk() {
      if (!this.selectedPrinterId) {
        alert(MESSAGE_PRINTER_SELECT)
      } else {
        this.handleSubmit()
      }
    },
    handleCancel() {
      this.isShow = false
    },
    handleSubmit() {
      // OR store holds key id and text value - emit id then store handles get name
      const printerName = this.printerOptions[this.selectedPrinterId].text
      this.$emit('selectPrinter', printerName)
      this.clearSelect()
      this.isShow = false
    },
    setPrinterNames() {
      const printerOptions = this.$store.getters.printers.map((printer, index) => ({
        value: index + 1,
        text: printer,
      }))
      printerOptions.unshift({ value: null, text: MESSAGE_PRINTER_SELECT })
      this.printerOptions = printerOptions
    },
    provider() {
      this.setPrinterNames()
    },
  },
}
</script>
