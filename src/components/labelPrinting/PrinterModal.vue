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
        v-model="selectedPrinterId"
        data-attribute="printer-options"
        :options="printerOptions"
      />
      <template #modal-footer="{ ok, cancel }">
        <traction-button size="sm" theme="accent" @click="ok()"> OK </traction-button>
        <traction-button size="sm" theme="cancel" @click="cancel()"> Cancel </traction-button>
      </template>
    </traction-modal>
  </DataFetcher>
</template>

<script setup>
/**
 * PrinterModal component is used to select a printer to print labels.
 */

import { usePrintingStore } from '@/stores/printing.js'
import DataFetcher from '@/components/DataFetcher.vue'
import { ref, computed } from 'vue'

const emit = defineEmits(['selectPrinter'])

const selectedPrinterId = ref(null) // selected printer id

const isShow = ref(false) // show modal

// eslint has got this wrong
// there is an npm package but it is overkill
// cant seem to disable this in the eslint config
/* eslint-disable no-unused-vars */
const props = defineProps({
  /**
   * Whether the component is disabled
   * @type {Boolean}
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether the component is static
   * @type {Boolean}
   * @default false
   */
  isStatic: {
    type: Boolean,
    default: false,
  },
})
/* eslint-enable no-unused-vars */

/**
 * Printer options
 * @returns {Array} - Printer options
 * @example [{ value: 1, text: 'Printer 1' }, { value: 2, text: 'Printer 2' }]
 */
const printerOptions = computed(() => {
  const options = usePrintingStore()
    .printers('tube')
    .map(({ name }, index) => ({
      value: index + 1,
      text: name,
    }))
  return [{ value: null, text: 'Please select a printer' }, ...options]
})

// set the selected printer id to null
const clearSelect = () => {
  selectedPrinterId.value = null
}

// show the modal
const onPrintAction = () => {
  isShow.value = true
}

// handle ok button click
const handleOk = () => {
  if (!selectedPrinterId.value) {
    alert('Please select a printer')
  } else {
    handleSubmit()
  }
}

// handle cancel button click
const handleCancel = () => {
  isShow.value = false
}

// handle submit
// emit the selected printer name
const handleSubmit = () => {
  // OR store holds key id and text value - emit id then store handles get name
  const printerName = printerOptions.value[selectedPrinterId.value].text
  emit('selectPrinter', printerName)
  clearSelect()
  isShow.value = false
}

// fetch printers
// if no printers are in the store, fetch them
// @returns {Promise} - Promise
const fetchPrinters = async () => {
  if (usePrintingStore().printers().length === 0) {
    return await usePrintingStore().fetchPrinters()
  } else {
    return { success: true }
  }
}
</script>
