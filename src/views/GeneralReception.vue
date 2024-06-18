<template>
  <div class="flex flex-row space-x-12 px-12">
    <loading-full-screen-modal v-bind="modalState"></loading-full-screen-modal>
    <div class="w-1/2 space-y-8">
      <div>
        <traction-heading level="4" :show-border="true"> Source </traction-heading>
        <traction-field-group
          label="Source"
          attribute="sourceSelect"
          for="sourceSelect"
          description="The location to import the labware from"
          layout="spacious"
        >
          <traction-select
            id="sourceSelect"
            v-model="source"
            class="inline-block w-full"
            :options="receptions.options"
            data-type="source-list"
            @update:model-value="handleSourceChange"
          />
        </traction-field-group>
      </div>

      <div>
        <traction-heading level="4" :show-border="true">Pipeline</traction-heading>
        <traction-field-group
          label="Pipeline"
          attribute="pipelineSelect"
          for="pipelineSelect"
          description="The Traction pipeline to import the requests into"
          layout="spacious"
        >
          <traction-select
            id="pipelineSelect"
            v-model="pipeline"
            :options="pipelineOptions"
            class="inline-block w-full"
            data-type="pipeline-list"
            @update:model-value="resetRequestOptions()"
          />
        </traction-field-group>
      </div>

      <div>
        <traction-heading level="4" :show-border="true"> Request Options </traction-heading>
        <traction-muted-text class="text-left"
          >Default values to apply to the imported requests</traction-muted-text
        >
        <div>
          <LibraryTypeSelect
            v-model="requestOptions.library_type"
            :label-cols="0"
            :allow-none="false"
            :import-text="`Import from ${source} (where available)`"
            :pipeline="pipeline.toLowerCase()"
          />
          <traction-field-group
            label="Cost Code"
            attribute="cost_code"
            for="cost_code"
            description="Default Pacbio cost code: S4699"
            layout="spacious"
          >
            <traction-input
              id="cost_code"
              v-model="requestOptions.cost_code"
              data-attribute="cost-code-input"
            ></traction-input>
          </traction-field-group>
          <div v-if="pipeline == 'PacBio'">
            <traction-field-group
              label="Number of SMRT cells"
              attribute="number_of_smrt_cells"
              for="number_of_smrt_cells"
              layout="spacious"
            >
              <traction-input
                id="number_of_smrt_cells"
                v-model="requestOptions.number_of_smrt_cells"
                data-attribute="smrt-cells-input"
                type="number"
                step="1"
                min="0"
              ></traction-input>
            </traction-field-group>
            <traction-field-group
              label="Number of Gigabases required"
              attribute="estimate_of_gb_required"
              for="estimate_of_gb_required"
              layout="spacious"
            >
              <traction-input
                id="estimate_of_gb_required"
                v-model="requestOptions.estimate_of_gb_required"
                data-attribute="estimate_of_gb_required"
                type="number"
                step="1"
                min="0"
              ></traction-input>
            </traction-field-group>
          </div>
          <div v-if="pipeline == 'ONT'">
            <traction-field-group
              label="Data Type"
              attribute="data_type"
              for="data_type"
              layout="spacious"
            >
              <DataTypeSelect v-model="requestOptions.data_type" pipeline="ont" />
            </traction-field-group>
            <traction-field-group
              label="Number of Flowcells"
              attribute="number_of_flowcells"
              for="number_of_flowcells"
              layout="spacious"
            >
              <traction-input
                id="number_of_flowcells"
                v-model="requestOptions.number_of_flowcells"
                data-attribute="number-of-flowcells-input"
                type="number"
                step="1"
                min="0"
              ></traction-input>
            </traction-field-group>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2 space-y-4">
      <div class="flex flex-col w-full">
        <traction-heading level="4" :show-border="true">Scan barcodes</traction-heading>
        <traction-field-group
          label="Barcodes"
          attribute="barcodes"
          for="barcodes"
          description="The list of labware barcodes to import from source"
          layout="spacious"
        >
          <textarea
            id="barcodes"
            v-model="barcodes"
            placeholder="Scan barcodes to print/import..."
            rows="4"
            max-rows="10"
            name="barcodes"
            class="w-full text-base py-2 px-3 border border-gray-300 bg-white rounded-md"
          />
        </traction-field-group>
      </div>
      <div v-if="displayPrintOptions" id="print" class="p-2 bg-gray-100 rounded p-3">
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
            Import {{ labwareData.foundBarcodes.size }} labware into {{ pipeline }} from
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { createReceptionResource, createMessages } from '@/services/traction/Reception.js'
import Receptions from '@/lib/receptions'
import TractionHeading from '../components/TractionHeading.vue'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect.vue'
import DataTypeSelect from '@/components/shared/DataTypeSelect.vue'
import { defaultRequestOptions } from '@/lib/receptions'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import { createBarcodeLabels, createBasicTubeBarcodeLabel } from '@/lib/LabelPrintingHelpers.js'
import { usePrintingStore } from '@/stores/printing.js'
import useRootStore from '@/stores'
import DataFetcher from '@/components/DataFetcher.vue'
import useAlert from '@/composables/useAlert.js'

// We don't expect the modal to display without a message. If we end up in this
// state then something has gone horribly wrong.
const stuckModal =
  "We appear to be stuck, this shouldn't happen. Please contact support, and try reloading the page"
const defaultModal = () => ({ visible: false, message: stuckModal })
const receptions = Receptions

const { showAlert } = useAlert()
const createPrintJob = usePrintingStore().createPrintJob

// Default source to sequencescape
const source = ref('Sequencescape')
// Default pipeline to PacBio
const pipeline = ref('PacBio')
const pipelineOptions = ref([
  { value: 'PacBio', text: 'PacBio' },
  { value: 'ONT', text: 'ONT' },
])
const requestOptions = ref(defaultRequestOptions())
const barcodes = ref('')
const modalState = ref(defaultModal())
// labwareData is used to store the input barcodes as well as the data fetched from sequencescape which is then imported into traction
const labwareData = ref({
  inputBarcodes: [], // inputBarcodes is used to store the barcodes that the user has inputted
  foundBarcodes: new Set(), // foundBarcodes is used to store the barcodes that have been found in sequencescape
  attributes: [], // attributes is used to store the attributes that have been found in sequencescape
})
const printerName = ref('')
let debounceTimer = ref(null) // debounce timer for barcode deletion
let isFetching = ref(false)

const printers = usePrintingStore().printers
const reception = computed(() => receptions[source.value])
const api = useRootStore().api.v1
const receptionRequest = api.traction.receptions.create
const barcodeArray = computed(() => [...new Set(barcodes.value.split(/\s/).filter(Boolean))])
const isDisabled = computed(() => Boolean(barcodeArray.value.length === 0 || isFetching.value))
const presentRequestOptions = computed(() =>
  Object.fromEntries(Object.entries(requestOptions).filter(([, v]) => v)),
)
//displayPrintOptions is used to decide whether print options should be displayed or not
const displayPrintOptions = computed(() =>
  ['SequencescapeTubes', 'SequencescapeMultiplexedLibraries'].includes(source.value),
)
// printBarcodes is used to display the barcodes that will be printed
const printBarcodes = computed(() => Array.from(labwareData.value.foundBarcodes).join('\n'))
// printerOptions is used to display the printers that are available to print to
const printerOptions = computed(() =>
  printers('tube').map(({ name }) => ({
    text: name,
  })),
)
// printEnabled is used to disable the print button if there are no barcodes to print
const printEnabled = computed(() => printerName.value && printBarcodes.value)

watch(barcodes, debounceBarcodeFetch, { immediate: true })
watch(requestOptions, debounceBarcodeFetch, { deep: true, immediate: true })

function clearModal() {
  modalState.value = defaultModal()
}

function showModal(message) {
  modalState.value = { visible: true, message }
}

//Debounces the barcodes field so that the barcodes are not fetched on every keypress or deletion
function debounceBarcodeFetch() {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer)
  }
  if (barcodeArray.value.length === 0) {
    labwareData.value.foundBarcodes.clear()
    isFetching.value = false
    return
  }
  isFetching.value = true
  debounceTimer.value = setTimeout(async () => {
    await fetchLabware()
    isFetching.value = false
  }, 500)
}

/*
  Imports the labware into traction.
  This function is called when the user presses 'import'
*/
async function importLabware() {
  showModal(
    `Creating ${labwareData.value.foundBarcodes.size} labware(s) for ${reception.value.text}`,
  )
  //Creates the reception resource and shows a success or failure alert
  try {
    const response = await createReceptionResource(
      receptionRequest,
      labwareData.value.foundBarcodes,
      labwareData.value.attributes,
    )
    const messages = createMessages({
      barcodes: Array.from(labwareData.value.foundBarcodes),
      response,
      reception: reception.value,
    })

    // we create a different alert for each message
    messages.forEach(({ type, text }) => {
      showAlert(text, type)
    })
    clearModal()
  } catch (e) {
    console.error(e)
    showAlert(e, 'danger')
    clearModal()
  }
}

/*
  Fetches the labware from sequencescape and updates the labwareData
  This function is called when the user presses 'enter' in the barcodes field
*/
async function fetchLabware() {
  try {
    //Fetch barcodes from sequencescape
    const { foundBarcodes, attributes } = await reception.value.fetchFunction({
      requests: api,
      barcodes: barcodeArray.value,
      requestOptions: presentRequestOptions.value,
    })
    labwareData.value = { foundBarcodes, attributes, inputBarcodes: barcodeArray.value }
    clearModal()
  } catch (e) {
    console.error(e)
    showAlert(e.toString(), 'danger')
  }
}

/*
  create the labels needed for the print job
*/
function createLabels(foundBarcodes, date) {
  const sourceBarcodeList = Array.from(foundBarcodes)
  const barcodeItems = sourceBarcodeList.map((barcode) => ({ barcode, date }))
  return createBarcodeLabels({ barcodeItems, createLabelFn: createBasicTubeBarcodeLabel })
}

/*
  Creates the print job and shows a success or failure alert
*/
async function printLabels() {
  const { success, message = {} } = await createPrintJob({
    printerName: printerName,
    labels: createLabels(labwareData.value.foundBarcodes, getCurrentDate()),
    copies: 1,
  })

  showAlert(message, success ? 'success' : 'danger')
}

function reset() {
  source.value = 'Sequencescape'
  pipeline.value = 'PacBio'
  requestOptions.value = defaultRequestOptions()
  barcodes.value = ''
  resetRequestOptions()
  resetLabwareData()
}

function resetRequestOptions() {
  requestOptions.value = defaultRequestOptions()
}

/*
  Resets the labwareData
*/
function resetLabwareData() {
  labwareData.value = {
    foundBarcodes: new Set(),
    attributes: [],
    inputBarcodes: [],
  }
}

/*
  Resets the labware data and input barcodes when the source is changed
*/
function handleSourceChange() {
  resetLabwareData()
  barcodes.value = ''
}

async function fetchPrinters() {
  if (usePrintingStore().printers().length === 0) {
    return await usePrintingStore().fetchPrinters()
  } else {
    return { success: true }
  }
}
</script>
