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
                v-model="printJob.sourceBarcodeList"
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
                v-model="labelOptions.suffix"
                :options="workflowDropdownOptions"
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
                v-model="printJob.numberOfLabels"
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
                  v-model="labelOptions.labelTypeKey"
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
                  v-model="printJob.printerName"
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
                <li v-for="{ barcode } in workflowBarcodeItems" :key="barcode" class="text-sm">
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
  createWorkflowDropdownOptions,
  createWorkflowOptions,
  PrintJobType,
  WorkflowListType,
  createWorkflowTubeBarcodeLabel,
  createWorkflowPlateBarcodeLabel,
  NullWorkflowItem,
} from '@/lib/LabelPrintingHelpers.js'
import WorkflowList from '@/config/WorkflowList.json'
import { nextTick } from 'vue'
import LabelTypes from '@/config/LabelTypes.json'

const { showAlert } = useAlert() // useAlert is a composable function that is used to create an alert.It is used to show a success or failure message.

/**
 * usePacbioLibrariesStore is a composable function that is used to access the 'printing' store.
 * It is used to fetch printers and create a print job.
 */
const printingStore = usePrintingStore()

const show = ref(true) // Create a ref for the show variable

const labelOptions = reactive({ suffix: '', labelTypeKey: 'tube2d' }) // label options to be used for suffixes and label type

let printJob = reactive(PrintJobType()) // Create a reactive for the print job

const workflowOptions = reactive(createWorkflowOptions(WorkflowList)) // Create a reactive for the workflow options

const workflowDropdownOptions = reactive(createWorkflowDropdownOptions(WorkflowList)) // Create a reactive for the workflow dropdown options

/**
 * Creates a map of functions to create labels
 */
const createLabelFns = {
  tube: createWorkflowTubeBarcodeLabel,
  plate96: createWorkflowPlateBarcodeLabel,
  plate384: createWorkflowPlateBarcodeLabel
}

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
  console.log(labelType)
  return printingStore.printers(labelType.value.labwareType).map(({ name }) => ({
    text: name,
  }))
})

/**
 * Creates a computed property to get the label type
 * Created from the selected label type
 * @returns {Object} label type
 * it would make sense to move this to the print job but it needs to be reactive. Not sure how to do that.
 */
const labelType = computed(() => {
  return LabelTypes[labelOptions.labelTypeKey]
})

/**
 * Creates a computed property to get the labels (workflow barcode items)
 * @returns {Array} labels
 */
const workflowBarcodeItems = computed(() => {
  const date = getCurrentDate()
  // without this we get an undefined error
  const workflowItem = workflowOptions[labelOptions.suffix] || NullWorkflowItem

  // it is possible for there to be no barcodes so we need to add a guard
  // we filter to remove any nulls
  const splitSourceBarcodeList =
    printJob.sourceBarcodeList?.split(/\r?\n|\r|\n/g).filter((b) => b) || []

  const workflowListType = WorkflowListType({
    sourceBarcodeList: splitSourceBarcodeList,
    date,
    workflowItem,
    numberOfLabels: printJob.numberOfLabels,
  })

  return workflowListType.createWorkflowBarcodeItemList()
})

/**
 * Creates a method to print labels
 * @returns {Object} success or failure message
 */
const printLabels = async () => {
  printJob.createLabels({
    barcodeItems: workflowBarcodeItems.value,
    createLabelFn: createLabelFns[labelType.value.labwareType],
  })
  // it would be better if this was reactive but couldn't get it to work
  printJob.labelType = labelType.value

  const { success, message = {} } = await printingStore.createPrintJob(printJob.payload())

  showAlert(message, success ? 'success' : 'danger')

  return { success, message }
}

/**
 * Creates a method to reset the print job
 */
const onReset = () => {
  // Reset our form values
  printJob = reactive(PrintJobType())

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
