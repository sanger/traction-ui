<template>
  <DataFetcher :fetcher="fetchPrinters">
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
      <traction-select
        data-attribute="printer-options"
        v-model="selectedPrinterId"
        :options="printerOptions"
      />
      <template #modal-footer="{ ok, cancel }">
        <traction-button size="sm" theme="accent" @click="ok()"> OK </traction-button>
        <traction-button size="sm" theme="cancel" @click="cancel()"> Cancel </traction-button>
      </template>
    </traction-modal>
  </DataFetcher>
</template>

<script>
import { usePrintingStore } from '@/stores/printing.js'
import { mapActions, mapState } from 'pinia'
import DataFetcher from '@/components/DataFetcher.vue'

export default {
  name: 'PrinterModal',
  components: {
    DataFetcher,
  },
  props: {
    disabled: Boolean,
    isStatic: Boolean,
  },
  emits: ['selectPrinter'],
  data() {
    return {
      selectedPrinterId: null,
      isShow: false,
    }
  },
  computed: {
    ...mapState(usePrintingStore, ['printers']),
    printerOptions() {
      const options = this.printers('tube').map(({ name }, index) => ({
        value: index + 1,
        text: name,
      }))
      return [{ value: null, text: 'Please select a printer' }, ...options]
    },
  },
  methods: {
    ...mapActions(usePrintingStore, ['fetchPrinters']),
    clearSelect() {
      this.selectedPrinterId = null
    },
    onPrintAction() {
      this.isShow = true
    },
    handleOk() {
      if (!this.selectedPrinterId) {
        alert('Please select a printer')
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
  },
}
</script>
