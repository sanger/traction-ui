<template>
  <div class="w-full md:w-3/4 mx-auto">
    <traction-form
      v-if="show"
      classes="flex flex-col md:flex-row px-10 gap-4"
      @submit="printLabels"
      @reset="onReset"
    >
      <div class="w-full md:w-3/5 p-4 gap-4 bg-gray-100 rounded-md">
        <div class="space-y-10">
          <fieldset>
            <BarcodeIcon class="float-left mr-2 mt-3" />
            <traction-heading level="3" show-border>Barcodes</traction-heading>
            <traction-muted-text>A list of barcodes to create labels for</traction-muted-text>
            <div class="mt-2">
              <textarea
                id="barcode-input"
                v-model="form.sourceBarcodeList"
                class="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:bg-gray-200 disabled:cursor-not-allowed"
                placeholder="Please scan the barcodes"
                required
                rows="6"
                max-rows="10"
              />
            </div>
          </fieldset>

          <fieldset>
            <traction-heading level="3" show-border>Suffix</traction-heading>
            <traction-muted-text>The suffix used to increment the barcode</traction-muted-text>
            <div class="mt-2">
              <traction-select
                id="suffix-selection"
                v-model="form.suffix"
                :options="suffixOptions"
                placeholder="Please select a suffix"
              ></traction-select>
            </div>
          </fieldset>

          <fieldset>
            <traction-heading level="3" show-border>Number of labels</traction-heading>
            <traction-muted-text>Number of labels to print (max 80)</traction-muted-text>
            <div class="mt-2">
              <traction-input
                id="number-of-labels"
                v-model="form.numberOfLabels"
                type="number"
                min="1"
                max="80"
                placeholder="Please enter a number"
              ></traction-input>
            </div>
          </fieldset>

          <DataFetcher :fetcher="fetchPrinters">
            <fieldset>
              <traction-heading level="3" show-border>Choice of Printer</traction-heading>
              <traction-heading level="5">Select label type</traction-heading>
              <div class="mt-2 pb-2">
                <traction-select
                  id="label-type"
                  v-model="form.labelType"
                  data-attribute="label-type-options"
                  :options="labelTypeOptions"
                  value-field="text"
                  required
                ></traction-select>
              </div>
              <traction-heading level="5">Select printer</traction-heading>
              <div class="mt-2">
                <traction-select
                  id="printer-choice"
                  v-model="form.printerName"
                  data-attribute="printer-options"
                  :options="printerOptions"
                  value-field="text"
                  required
                ></traction-select>
              </div>
            </fieldset>
          </DataFetcher>
        </div>
      </div>
      <div class="w-full md:w-2/5 p-4 space-y-4 bg-sdb-400 rounded-md border-t-4 border-sp">
        <traction-heading level="3" class-name="text-white italic" show-border>
          Preview Barcodes
        </traction-heading>
        <div>
          <div class="space-x-4 pb-4 flex flex-row">
            <traction-button id="submit-button" class="grow" type="submit" theme="printRed">
              Print Labels
            </traction-button>
            <traction-button id="reset-button" type="reset" theme="resetWhite">
              Reset
            </traction-button>
          </div>

          <div tag="article" class="mb-2 text-black text-left">
            <div class="flex flex-col bg-white rounded p-4">
              <ul id="list-barcodes-to-print">
                <li v-for="{ barcode } in labels" :key="barcode" class="text-sm">
                  {{ barcode }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </traction-form>
  </div>
</template>

<script setup>
/**
 * LabelPrintingForm component is used to print labels.
 */

import { ref, computed, reactive } from 'vue'
import { usePrintingStore } from '@/stores/printing.js'
import useAlert from '@/composables/useAlert.js'
import DataFetcher from '@/components/DataFetcher.vue'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import {
  createSuffixDropdownOptions,
  createSuffixItems,
  createLabelsFromBarcodes,
} from '@/lib/LabelPrintingHelpers.js'
import SuffixList from '@/config/SuffixList.json'
import { nextTick } from 'vue'
import LabelTypes from '@/config/LabelTypes.json'

/**
 * provides default values for the form
 * @returns {Object} default form values
 */
const defaultForm = () => ({
  sourceBarcodeList: null,
  suffix: null, // Default to No suffix
  numberOfLabels: null,
  printerName: null,
  copies: 1,
  labelType: 'tube2d',
})

const { showAlert } = useAlert() // useAlert is a composable function that is used to create an alert.It is used to show a success or failure message.

/**
 * usePacbioLibrariesStore is a composable function that is used to access the 'printing' store.
 * It is used to fetch printers and create a print job.
 */
const printingStore = usePrintingStore()

let form = reactive(defaultForm()) // Create a reactive for the form

const show = ref(true) // Create a ref for the show variable

/**
 * Creates a computed property to get the label type options
 * @returns {Array} label type options
 */
const labelTypeOptions = computed(() => {
  return Object.values(LabelTypes).map(({ text, value }) => ({
    text,
    value,
  }))
})

/**
 * Creates a computed property to get the printer names
 * @returns {Array} printer names
 */
const printerOptions = computed(() => {
  return printingStore.printers(labelType.value.labwareType).map(({ name }) => ({
    text: name,
  }))
})

/**
 * Creates a computed property to get the label type
 * Created from the selected label type
 * @returns {Object} label type
 */
const labelType = computed(() => {
  return LabelTypes[form.labelType]
})

/**
 * Creates a computed property to get the suffix options
 * @returns {Array} suffix options
 */
const suffixOptions = computed(() => {
  return createSuffixDropdownOptions(SuffixList)
})

/**
 * Creates a computed property to get the suffix items
 * @returns {Array} suffix items
 */
const suffixItems = computed(() => {
  return createSuffixItems(SuffixList)
})

/**
 * Creates a computed property to get the labels
 * @returns {Array} labels
 */
const labels = computed(() => {
  const date = getCurrentDate()
  const suffixItem = suffixItems.value[form.suffix]

  // it is possible for there to be no barcodes so we need to add a guard
  // we filter to remove an nulls
  const splitSourceBarcodeList =
    form.sourceBarcodeList?.split(/\r?\n|\r|\n/g).filter((b) => b) || []

  return createLabelsFromBarcodes({
    sourceBarcodeList: splitSourceBarcodeList,
    date,
    suffixItem,
    numberOfLabels: form.numberOfLabels,
  })
})

/**
 * Creates a method to print labels
 * @returns {Object} success or failure message
 */
const printLabels = async () => {
  const { success, message = {} } = await printingStore.createPrintJob({
    printerName: form.printerName,
    labels: labels.value,
    copies: form.copies,
    labelTemplateName: labelType.value.labelTemplateName,
  })

  showAlert(message, success ? 'success' : 'danger')

  return { success, message }
}

/**
 * Creates a method to reset the form
 */
const onReset = () => {
  // Reset our form values
  form = reactive(defaultForm())

  // Trick to reset/clear native browser form validation state
  show.value = false
  nextTick(() => {
    show.value = true
  })
}

// fetch printers
// if no printers are in the store, fetch them
// if there are printers in the store, return success prevents error in DataFetcher
// @returns {Promise} - Promise
const fetchPrinters = async () => {
  if (printingStore.printers().length === 0) {
    return await printingStore.fetchPrinters()
  } else {
    return { success: true }
  }
}
</script>
