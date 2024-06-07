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

<script>
// TODO: Move to composition api. Already using pinia store.
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
import { mapActions, mapState } from 'pinia'
import DataFetcher from '@/components/DataFetcher.vue'

// We don't expect the modal to display without a message. If we end up in this
// state then something has gone horribly wrong.
const stuckModal =
  "We appear to be stuck, this shouldn't happen. Please contact support, and try reloading the page"
const defaultModal = () => ({ visible: false, message: stuckModal })

export default {
  name: 'GeneralReception',
  components: {
    TractionHeading,
    LibraryTypeSelect,
    DataTypeSelect,
    DataFetcher,
  },
  props: {
    receptions: {
      type: Object,
      default: () => Receptions,
    },
  },
  data: () => ({
    // Default source to sequencescape
    source: 'Sequencescape',
    // Default pipeline to PacBio
    pipeline: 'PacBio',
    pipelineOptions: [
      { value: 'PacBio', text: 'PacBio' },
      { value: 'ONT', text: 'ONT' },
    ],
    requestOptions: defaultRequestOptions(),
    barcodes: '',
    modalState: defaultModal(),
    // labwareData is used to store the input barcodes as well as the data fetched from sequencescape which is then imported into traction
    labwareData: {
      inputBarcodes: [], // inputBarcodes is used to store the barcodes that the user has inputted
      foundBarcodes: new Set(), // foundBarcodes is used to store the barcodes that have been found in sequencescape
      attributes: [], // attributes is used to store the attributes that have been found in sequencescape
    },
    printerName: '',
    debounceTimer: null, // debounce timer for barcode deletion
    isFetching: false,
  }),
  computed: {
    ...mapState(usePrintingStore, ['printers']),
    // ...mapState(useRootStore, ['api']),
    reception: ({ receptions, source }) => receptions[source],
    api() {
      return useRootStore().api.v1
    }, // can't use this in arrow function
    receptionRequest: ({ api }) => api.traction.receptions.create,
    barcodeArray: ({ barcodes }) => [...new Set(barcodes.split(/\s/).filter(Boolean))],
    isDisabled: ({ barcodeArray, isFetching }) => Boolean(barcodeArray.length === 0 || isFetching),
    barcodeCount: ({ barcodeArray }) => barcodeArray.length,
    presentRequestOptions: ({ requestOptions }) =>
      Object.fromEntries(Object.entries(requestOptions).filter(([, v]) => v)),
    //displayPrintOptions is used to decide whether print options should be displayed or not
    displayPrintOptions: ({ source }) => source === 'SequencescapeTubes',
    // printBarcodes is used to display the barcodes that will be printed
    printBarcodes: ({ labwareData }) => Array.from(labwareData.foundBarcodes).join('\n'),
    // printerOptions is used to display the printers that are available to print to
    printerOptions() {
      return this.printers('tube').map(({ name }) => ({
        text: name,
      }))
    },
    // printEnabled is used to disable the print button if there are no barcodes to print
    printEnabled: ({ printerName, printBarcodes }) => printerName && printBarcodes,
  },
  watch: {
    // Refetches the data when the barcodes field is changed
    barcodes: {
      handler: 'debounceBarcodeFetch',
      immediate: true,
    },
    // Refetches the data when a request option changes as it may require information from sequencescape
    requestOptions: {
      handler: 'debounceBarcodeFetch',
      deep: true,
      immediate: true,
    },
  },
  methods: {
    clearModal() {
      this.modalState = defaultModal()
    },
    showModal(message) {
      this.modalState = { visible: true, message }
    },
    //Debounces the barcodes field so that the barcodes are not fetched on every keypress or deletion
    debounceBarcodeFetch() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      if (this.barcodeArray.length === 0) {
        this.labwareData.foundBarcodes.clear()
        this.isFetching = false
        return
      }
      this.isFetching = true
      this.debounceTimer = setTimeout(async () => {
        await this.fetchLabware()
        this.isFetching = false
      }, 500)
    },
    /*
      Imports the labware into traction.
      This function is called when the user presses 'import'
    */
    async importLabware() {
      this.showModal(
        `Creating ${this.labwareData.foundBarcodes.size} labware(s) for ${this.reception.text}`,
      )
      //Creates the reception resource and shows a success or failure alert
      try {
        const response = await createReceptionResource(
          this.receptionRequest,
          this.labwareData.foundBarcodes,
          this.labwareData.attributes,
        )
        const messages = createMessages({
          barcodes: Array.from(this.labwareData.foundBarcodes),
          response,
          reception: this.reception,
        })

        // we create a different alert for each message
        messages.forEach(({ type, text }) => {
          this.showAlert(text, type)
        })
        this.clearModal()
      } catch (e) {
        console.error(e)
        this.showAlert(e, 'danger')
        this.clearModal()
      }
    },

    /*
    Fetches the labware from sequencescape and updates the labwareData
    This function is called when the user presses 'enter' in the barcodes field
    */
    async fetchLabware() {
      try {
        //Fetch barcodes from sequencescape
        const { foundBarcodes, attributes } = await this.reception.fetchFunction({
          requests: this.api,
          barcodes: this.barcodeArray,
          requestOptions: this.presentRequestOptions,
        })
        this.labwareData = { foundBarcodes, attributes, inputBarcodes: this.barcodeArray }
        this.clearModal()
      } catch (e) {
        console.error(e)
        this.showAlert(e.toString(), 'danger')
      }
    },
    /*
      create the labels needed for the print job
    */
    createLabels(foundBarcodes, date) {
      const sourceBarcodeList = Array.from(foundBarcodes)
      const barcodeItems = sourceBarcodeList.map((barcode) => ({ barcode, date }))
      return createBarcodeLabels({ barcodeItems, createLabelFn: createBasicTubeBarcodeLabel })
    },
    /*
      Creates the print job and shows a success or failure alert
    */
    async printLabels() {
      const { success, message = {} } = await this.createPrintJob({
        printerName: this.printerName,
        labels: this.createLabels(this.labwareData.foundBarcodes, getCurrentDate()),
        copies: 1,
      })

      this.showAlert(message, success ? 'success' : 'danger')
    },
    reset() {
      this.source = 'Sequencescape'
      this.pipeline = 'PacBio'
      this.requestOptions = defaultRequestOptions()
      this.barcodes = ''
      this.resetRequestOptions()
      this.resetLabwareData()
    },
    resetRequestOptions() {
      this.requestOptions = defaultRequestOptions()
    },
    /*
      Resets the labwareData
    */
    resetLabwareData() {
      this.labwareData = {
        foundBarcodes: new Set(),
        attributes: [],
        inputBarcodes: [],
      }
    },
    /*
      Resets the labware data and input barcodes when the source is changed
    */
    handleSourceChange() {
      this.resetLabwareData()
      this.barcodes = ''
    },
    async fetchPrinters() {
      if (usePrintingStore().printers().length === 0) {
        return await usePrintingStore().fetchPrinters()
      } else {
        return { success: true }
      }
    },
    ...mapActions(usePrintingStore, ['createPrintJob']),
  },
}
</script>
