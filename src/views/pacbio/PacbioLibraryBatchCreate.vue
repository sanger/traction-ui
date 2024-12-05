<template>
  <DataFetcher :fetcher="fetchData">
    <div class="w-full h-screen px-4">
      <div class="flex flex-row w-full h-full">
        <div class="w-1/2 px-4">
          <div class="flex flex-col space-y-4">
            <traction-section
              title="Create Library Batch"
              number="1"
              description="To get started, please select a tag set and csv file, then press the 'Create Libraries' button"
            ></traction-section>
            <div class="text-left px-4">
              Select tag set
              <traction-select
                v-model="selectedTagSet"
                data-type="tag-set-list"
                :options="pacbioRootStore.tagSetChoices"
              ></traction-select>
            </div>
            <div class="px-4">
              <label class="flex text-left" for="csvFieInput">Select csv file</label>
              <div class="flex flex-row space-x-2">
                <div id="borderDiv" class="w-full">
                  <input
                    id="csvFileInput"
                    ref="csvFileInput"
                    class="block rounded border file:border-0 w-full"
                    type="file"
                    accept="text/csv, .csv"
                    @change="onSelectFile"
                  />
                </div>
                <traction-button
                  data-type="csv-preview-btn"
                  class="whitespace-nowrap"
                  :disabled="isDisabledCSVPreview"
                  @click="showCSVPreview = !showCSVPreview"
                  >{{ isDisplayCSVPreview ? 'Hide CSV Data' : 'Show CSV Data' }}</traction-button
                >
              </div>
            </div>
            <div v-if="isDisplayCSVPreview" class="flex flex-row space-x-4">
              <div class="w-full h-64 overflow-y-auto border-2" data-type="csv-preview">
                <traction-table :fields="state.csvTableFields" :items="state.csvData" />
              </div>
            </div>
            <div class="flex flex-row space-x-8 py-4 px-4">
              <traction-button id="reset" theme="reset" data-action="reset-form" @click="onReset">
                Reset
              </traction-button>
              <traction-button
                id="create"
                :disabled="isCreateDisabled"
                full-width
                theme="create"
                data-action="create-libraries"
                @click="createLibraryBatch"
              >
                Create Libraries
              </traction-button>
            </div>

            <traction-section
              title="View Created Libraries"
              number="2"
              description="Once the 'Create Libraries' button is clicked, all the created libraries will be displayed here."
            ></traction-section>
            <div class="flex flex-row space-x-4">
              <div class="w-full overflow-y-auto">
                <traction-table
                  id="library-batch-table"
                  :fields="state.resultTableFields"
                  :items="state.resultData"
                />
                <div
                  v-show="!state.resultData.length"
                  data-type="created-libraries"
                  class="text-sm font-bold text-black"
                >
                  No Libraries Created Yet
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-1/2 px-4">
          <div class="flex flex-col space-y-4">
            <traction-section
              title="Print Labels"
              number="3"
              description="Once the libraries are created, please select a printer and press the 'Print Labels' button"
            ></traction-section>

            <div class="text-left px-4 pb-4">
              Select Printer
              <traction-select
                v-model="selectedPrinterName"
                data-type="printer-options"
                :options="printerOptions"
              />
            </div>

            <div class="w-full h-full border-2">
              <div class="w-full h-full p-4 space-y-4 rounded-md">
                <traction-heading level="4" show-border> Preview Barcodes </traction-heading>
                <div class="h-full">
                  <div class="space-x-4 pb-4 flex flex-row">
                    <traction-button
                      id="print-button"
                      class="grow"
                      :disabled="isPrintDisabled"
                      theme="printRed"
                      @click="onPrintAction"
                    >
                      Print Labels
                    </traction-button>
                  </div>

                  <div tag="article" class="mb-2 text-black text-left">
                    <div class="flex flex-col rounded p-4">
                      <ul
                        v-if="printBarcodes.length"
                        id="list-barcodes-to-print"
                        class="space-y-2 justify-center text-center"
                      >
                        <li
                          v-for="barcode in printBarcodes"
                          :key="barcode"
                          class="text-sm text-sp font-bold"
                        >
                          {{ barcode }}
                        </li>
                      </ul>
                      <div
                        v-else
                        data-type="empty-barcodes"
                        class="justify-center text-center text-black text-sm font-bold"
                      >
                        No Barcodes to Print Yet
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DataFetcher>
</template>

<script setup>
/**
 * PacbioLibraryBatchCreate.vue
 *
 * This component is used to create a library batch from a csv file and tag set
 * and print labels for the created libraries
 *
 * @module PacbioLibraryBatchCreate
 */
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import { usePrintingStore } from '@/stores/printing.js'
import { usePacbioLibraryBatchCreateStore } from '@/stores/pacbioLibraryBatchCreate.js'
import { computed, ref, reactive } from 'vue'
import DataFetcher from '@/components/DataFetcher.vue'
import { eachRecord } from '@/lib/csv/pacbio.js'
import useAlert from '@/composables/useAlert.js'
import usePacbioLibraryPrint from '@/composables/usePacbioLibraryPrint.js'

const pacbioRootStore = usePacbioRootStore()
const pacbioLibraryBatchCreateStore = usePacbioLibraryBatchCreateStore()
const { printers, fetchPrinters } = usePrintingStore()
const { showAlert } = useAlert()
const { printLabels } = usePacbioLibraryPrint()

const defaultTagSetName = 'Pacbio_96_barcode_plate_v3'

const selectedPrinterName = ref('') // selected printer id
const showCSVPreview = ref(true) // Show preview of the csv file
const selectedTagSet = ref('') // Chosen tag set
const csvFileInput = ref('') //Reference to the csv file input component
/**
 * Set the default tag set
 *
 */
const setDefaultTagSet = () => {
  const defaultTagSet = pacbioRootStore.tagSetChoices.find(
    (option) => option.text === defaultTagSetName,
  )
  if (defaultTagSet) {
    selectedTagSet.value = defaultTagSet.value
  }
}

async function fetchData() {
  const ret = await pacbioRootStore.fetchPacbioTagSets()
  if (!ret.success) {
    return ret
  }
  setDefaultTagSet()
  return await fetchPrinters()
}

const selectedCSVFile = ref('') //Reference to the selected csv file

const isDisabledCSVPreview = computed(() => !state.csvData.length)

const isCreateDisabled = computed(() => !selectedTagSet.value || !selectedCSVFile.value)

const printBarcodes = computed(() => state.resultData.map((item) => item.barcode))

const isPrintDisabled = computed(() => !selectedPrinterName.value || !printBarcodes.value.length)

const isDisplayCSVPreview = computed(() => showCSVPreview.value && state.csvData.length)

/**
 * Printer options
 * @returns {Array} - Printer options
 * @example [{ value: 1, text: 'Printer 1' }, { value: 2, text: 'Printer 2' }]
 */
// printerOptions is used to display the printers that are available to print to
const printerOptions = computed(() => {
  return printers('tube').map(({ name }) => ({
    text: name,
  }))
})


const csvTableFields = [
  { key: 'source', label: 'Source' },
  { key: 'tag', label: 'Tag' },
  { key: 'template_prep_kit_box_barcode', label: 'Template prep kit box barcode' },
  { key: 'volume', label: 'Volume' },
  { key: 'concentration', label: 'Concentration' },
  { key: 'insert_size', label: 'Insert size' },
]
//define reactive variables
const state = reactive({
  csvTableFields,
  // Define fields for the table
  resultTableFields: [{ key: 'barcode', label: 'Barcode' }, ...csvTableFields],
  csvData: [],
  resultData: [],
})

/**
 * Handles the csv file selection
 * @param evt - Event object
 */
const onSelectFile = async (evt) => {
  state.csvData = []
  if (evt?.target?.files?.length) {
    selectedCSVFile.value = evt.target.files[0]
    try {
      const csv = await selectedCSVFile.value.text()
      //Parse the csv file
      const records = eachRecord(csv, () => {})
      state.csvData = records.map((record) => record.record)

      
    } catch (error) {
      showAlert(error, 'danger')
    }
  }
}

/**
 * Resets the form
 */
const onReset = () => {
  state.csvData = []
  state.resultData = []
  csvFileInput.value.value = ''
  selectedPrinterName.value = null
  setDefaultTagSet()
}

/**
 * Creates a library batch from the selected tag set and csv file
 */
const createLibraryBatch = async () => {
  //reset the existing result data 
  state.resultData = []
  const selectedTagSetName = pacbioRootStore.tagSetChoices.find(
    (tagset) => tagset.value === selectedTagSet.value,
  )?.text
  if (!selectedTagSetName) {
    showAlert('Please select a tag set', 'danger')
    return
  }
  const { success, errors, result } = await pacbioLibraryBatchCreateStore.createLibraryBatch(
    selectedCSVFile.value,
    selectedTagSetName,
  )
  if (success) {
    state.resultData = result
    // Clear the csv file input, so that 'Create Libraries' button is disabled
    selectedCSVFile.value = ''
  } else {
    showAlert(errors, 'danger')
  }
}

/**
 * Prints the labels for the created libraries
 */
const onPrintAction = async () => {
  const { success, message = {} } = await printLabels(
    selectedPrinterName.value,
    pacbioLibraryBatchCreateStore.librariesInfoInPrintFormat,
  )
  showAlert(message, success ? 'success' : 'danger')
}
</script>
