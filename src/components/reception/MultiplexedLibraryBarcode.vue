<template>
  <DataFetcher :fetcher="fetchData" class="space-y-4">
    <div class="flex flex-col w-full">
      <traction-heading level="4" :show-border="true">Scan barcodes</traction-heading>
      <traction-field-group
        label="Barcode"
        attribute="barcode"
        for="barcode"
        description="Multiplexed library barcode to import into Traction (one per import)"
        layout="spacious"
      >
        <traction-input
          id="barcode"
          v-model="barcode"
          placeholder="Scan barcode to print/import..."
          name="barcode"
        />
      </traction-field-group>
    </div>
    <div>
      <traction-heading level="4" :show-border="true">Tag sets</traction-heading>
      <traction-field-group
        label="Tag set"
        attribute="tag-set"
        for="tag-set-list"
        description="Please select the tag set of the imported library (required)"
        layout="spacious"
      >
        <traction-select
          v-model="tagSet"
          data-type="tag-set-list"
          :options="tagSetOptions"
        ></traction-select>
      </traction-field-group>
    </div>
    <div id="print" class="p-2 bg-gray-100 rounded p-3">
      <traction-heading level="4" :show-border="true">Print labels</traction-heading>
      <div class="flex flex-row space-x-4 w-full">
        <div class="flex flex-col w-1/2 text-left space-y-2">
          <traction-label>Barcodes</traction-label>
          <textarea
            id="print-barcodes"
            v-model="printBarcodes"
            class="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:bg-gray-200 disabled:cursor-not-allowed"
            rows="4"
            disabled
            max-rows="10"
          />
        </div>
        <DataFetcher :fetcher="fetchPrinters">
          <div class="flex flex-col text-left w-full space-y-2">
            <traction-label>Printers</traction-label>
            <traction-select
              id="printer-choice"
              v-model="printerName"
              data-attribute="printer-options"
              :options="printerOptions"
              value-field="text"
              :classes="'p-0'"
              required
            />
          </div>
        </DataFetcher>
      </div>
      <div class="flex justify-end mt-3 w-full">
        <traction-button
          id="print-button"
          class="grow"
          theme="print"
          :disabled="!printEnabled"
          @click="printLabels"
          >Print Labels</traction-button
        >
      </div>
    </div>
    <div class="bg-gray-100 rounded p-3">
      <traction-heading level="4" :show-border="true"> Summary </traction-heading>
      <div class="flex flex-col w-full">
        <traction-muted-text class="text-left">Imports data into Traction</traction-muted-text>
        <p id="importText" class="text-left">
          Import {{ labwareData.foundBarcodes.size }} labware into {{ props.pipeline }} from
          {{ reception.text }}
        </p>
        <div class="flex flex-row space-x-8 mt-5">
          <traction-button
            id="reset"
            full-width
            theme="reset"
            data-action="reset-form"
            @click="reset"
          >
            Reset
          </traction-button>
          <traction-button
            id="importLabware"
            :disabled="isDisabled"
            full-width
            theme="create"
            data-action="import-labware"
            @click="importLabware"
          >
            <traction-spinner v-if="isFetching" class="h-5"></traction-spinner>
            <span v-else class="button-text">Import</span>
          </traction-button>
        </div>
      </div>
    </div>
  </DataFetcher>
</template>

<!-- 
     A custom form for importing single multiplexed libraries into traction.
     Used by lib/receptions/index.js when defining the method of importing barcodes in the reception.  
  -->
<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { usePrintingStore } from '@/stores/printing.js'
import useAlert from '@/composables/useAlert.js'
import useRootStore from '@/stores'
import { createBarcodeLabels, createBasicTubeBarcodeLabel } from '@/lib/LabelPrintingHelpers.js'
import { createReceptionResource, createMessages } from '@/services/traction/Reception.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import DataFetcher from '@/components/DataFetcher.vue'

const props = defineProps({
  pipeline: {
    type: String,
    default: '',
  },
  reception: {
    type: Object,
    default: () => ({}),
  },
  requestOptions: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['importStarted', 'importFinished', 'reset'])

const { showAlert } = useAlert()
const { createPrintJob, printers } = usePrintingStore()
const rootStore = useRootStore()
const api = useRootStore().api.v2
const receptionRequest = api.traction.receptions.create

const barcode = ref('')
const isFetching = ref(false)
const printerName = ref('')
// labwareData is used to store the input barcodes as well as the data fetched from sequencescape which is then imported into traction
let labwareData = reactive({
  inputBarcodes: [], // inputBarcodes is used to store the barcodes that the user has inputted
  foundBarcodes: new Set(), // foundBarcodes is used to store the barcodes that have been found in sequencescape
  attributes: [], // attributes is used to store the attributes that have been found in sequencescape
})
let debounceTimer = null // debounce timer for barcode deletion
const tagSet = ref(null) // Chosen tag set

// printBarcodes is used to display the barcodes that will be printed
const printBarcodes = computed(() => Array.from(labwareData.foundBarcodes).join('\n'))
// printerOptions is used to display the printers that are available to print to
const printerOptions = computed(() =>
  printers('tube').map(({ name }) => ({
    text: name,
  })),
)
// printEnabled is used to disable the print button if there are no barcodes to print
const printEnabled = computed(() => printerName.value && printBarcodes.value)
const barcodeArray = computed(() => (barcode.value ? [barcode.value] : []))
const isDisabled = computed(() =>
  Boolean(barcodeArray.value.length === 0 || isFetching.value || !tagSet.value),
)
const presentRequestOptions = computed(() =>
  Object.fromEntries(Object.entries(props.requestOptions).filter(([, v]) => v)),
)
const libraryOptions = computed(() => {
  return { kit_barcode: tagSet.value }
})
const tagSetOptions = computed(() => {
  return [
    { value: null, text: 'Please select a tag set' },
    ...rootStore.tagSetsArray.map(({ name: value, name: text }) => ({
      value,
      text,
    })),
  ]
})

watch(barcode, debounceBarcodeFetch, { immediate: true })
watch(tagSet, debounceBarcodeFetch, { immediate: true })
watch(() => props.requestOptions, debounceBarcodeFetch, { deep: true, immediate: true })
watch(() => props.reception, resetLabwareData, { immediate: true })

/**
 * Resets the component data and emits a reset event
 */
function reset() {
  emit('reset')
  resetLabwareData()
}

/**
 * Resets the labwareData
 */
function resetLabwareData() {
  barcode.value = ''
  Object.assign(labwareData, { foundBarcodes: new Set(), attributes: [], inputBarcodes: [] })
}

/**
 * Fetches the printers to populate the printing store
 * @returns {Object} { success: boolean } - whether the fetch was successful
 */
async function fetchPrinters() {
  if (usePrintingStore().printers().length === 0) {
    return await usePrintingStore().fetchPrinters()
  } else {
    return { success: true }
  }
}

/**
 * Creates the labels for the barcodes found in the source
 * @param {Set} foundBarcodes - Set of barcodes found from the source
 * @param {Date} date - Date to be printed on the label
 */
function createLabels(foundBarcodes, date) {
  const sourceBarcodeList = Array.from(foundBarcodes)
  const barcodeItems = sourceBarcodeList.map((barcode) => ({ barcode, date }))
  return createBarcodeLabels({ barcodeItems, createLabelFn: createBasicTubeBarcodeLabel })
}

/**
 * Creates a print job and shows a success or failure alert
 */
async function printLabels() {
  const { success, message = {} } = await createPrintJob({
    printerName: printerName.value,
    labels: createLabels(labwareData.foundBarcodes, getCurrentDate()),
    copies: 1,
  })

  showAlert(message, success ? 'success' : 'danger')
}

/**
 * A debounce function for fetching barcodes
 * Debounce of 500ms proivded the barcode array is not empty and a fetch is not already in progress
 */
function debounceBarcodeFetch() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  if (barcodeArray.value.length === 0) {
    labwareData.foundBarcodes.clear()
    isFetching.value = false
    return
  }
  isFetching.value = true
  debounceTimer = setTimeout(async () => {
    await fetchLabware()
    isFetching.value = false
  }, 500)
}

/**
 * Imports the labware into traction
 * Creates the reception resource and shows a success or failure alert
 */
async function importLabware() {
  emit('importStarted', {
    barcode_count: labwareData.foundBarcodes.size,
  })
  //Creates the reception resource and shows a success or failure alert
  try {
    const response = await createReceptionResource(
      receptionRequest,
      labwareData.foundBarcodes,
      labwareData.attributes,
    )

    const messages = createMessages({
      barcodes: Array.from(labwareData.foundBarcodes),
      response,
      reception: props.reception,
    })

    // we create a different alert for each message
    messages.forEach(({ type, text }) => {
      showAlert(text, type)
    })
    emit('importFinished')
  } catch (e) {
    console.error(e)
    showAlert(e, 'danger')
    emit('importFinished')
  }
}

/**
 * Fetches the labware from sequencescape and updates the labwareData
 * Shows an alert if there is an error
 */
async function fetchLabware() {
  try {
    //Fetch barcodes from sequencescape
    const { foundBarcodes, attributes } = await props.reception.fetchFunction({
      requests: api,
      barcodes: barcodeArray.value,
      requestOptions: presentRequestOptions.value,
      libraryOptions: libraryOptions.value,
    })

    Object.assign(labwareData, { foundBarcodes, attributes, inputBarcodes: barcodeArray.value })
    emit('importFinished')
  } catch (e) {
    console.error(e)
    showAlert(e.toString(), 'danger')
  }
}

/**
 * Fetches the data required for the component
 * Fetches the printers and the tag sets
 */
async function fetchData() {
  await fetchPrinters()
  return await rootStore.fetchTagSets('ont')
}
</script>
