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
            @update:modelValue="resetRequestOptions()"
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
    <div class="w-1/2 space-y-8">
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
            placeholder="Scan barcodes to import..."
            rows="4"
            max-rows="10"
            name="barcodes"
            class="w-full text-base py-2 px-3 border border-gray-300 bg-white rounded-md"
          />
        </traction-field-group>
      </div>
      <div v-if="printEnabled">
        <traction-heading level="4" :show-border="true">Print labels</traction-heading>
        <traction-field-group
          label=""
          attribute="printLabels"
          for="printLabels"
          description="Print labels for the imported labware"
          layout="spacious"
        >
          <traction-button
            id="printLabels"
            full-width
            theme="create"
            data-action="print-labels"
            :disabled="isDisabled"
            @click="fetchLabware"
          >
            Create Print labels
          </traction-button>
        </traction-field-group>
        <div v-if="displayPrintOptions">
          <fieldset>
            <BarcodeIcon class="float-left mr-2 mt-3" />
            <traction-heading level="3" show-border>Barcodes</traction-heading>
            <traction-muted-text>A list of barcodes to create labels for</traction-muted-text>
            <div class="mt-2">
              <textarea
                id="barcode-input"
                v-model="labwareData.foundBarcodes"
                class="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:bg-gray-200 disabled:cursor-not-allowed"
                placeholder="Please scan the barcodes"
                required
                rows="6"
                max-rows="10"
              />
            </div>
          </fieldset>
        </div>
      </div>
      <div class="bg-gray-100 rounded p-3">
        <traction-heading level="4" :show-border="true"> Summary </traction-heading>
        <div class="flex flex-col w-full">
          <traction-muted-text class="text-left">Imports data into Traction</traction-muted-text>
          <p id="importText" class="text-left">
            Import {{ barcodeCount }} labware into {{ pipeline }} from {{ reception.text }}
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
              Import
            </traction-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createReceptionResource, createMessages } from '@/services/traction/Reception'
import Receptions from '@/lib/receptions'
import TractionHeading from '../components/TractionHeading.vue'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import DataTypeSelect from '@/components/shared/DataTypeSelect'
import { defaultRequestOptions } from '@/lib/receptions'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'

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
    BarcodeIcon,
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
    labwareData: {
      foundBarcodes: new Set(),
      attributes: {},
    },
  }),
  computed: {
    reception: ({ receptions, source }) => receptions[source],
    api() {
      return this.$store.getters.api
    }, // can't use this in arrow function
    receptionRequest: ({ api }) => api.traction.receptions.create,
    barcodeArray: ({ barcodes }) => barcodes.split(/\s/).filter(Boolean),
    isDisabled: ({ barcodeArray }) => barcodeArray.length === 0,
    barcodeCount: ({ barcodeArray }) => barcodeArray.length,
    presentRequestOptions: ({ requestOptions }) =>
      Object.fromEntries(Object.entries(requestOptions).filter(([, v]) => v)),
    printEnabled: ({ source }) => source === 'SequencescapeTubes',
    displayPrintOptions: ({ source, labwareData }) =>
      source === 'SequencescapeTubes' && labwareData.foundBarcodes.size > 0,
  },
  methods: {
    fetchStarted({ message }) {
      this.showModal(message)
    },
    clearModal() {
      this.modalState = defaultModal()
      this.labwareData = {
        foundBarcodes: new Set(),
        attributes: {},
      }
    },
    showModal(message) {
      this.modalState = { visible: true, message }
    },
    handleBarcode() {},
    fetchFailed({ message }) {
      this.clearModal()
      this.showAlert(message, 'danger')
    },
    async importLabware() {
      if (this.labwareData.foundBarcodes.size === 0) {
        await this.fetchLabware()
        if (this.labwareData.foundBarcodes.size === 0) {
          return
        }
      }
      this.showModal(
        `Creating ${this.labwareData.foundBarcodes.size} labware(s) for ${this.reception.text}`,
      )

      try {
        const response = await createReceptionResource(
          this.receptionRequest,
          this.labwareData.foundBarcodes,
          this.labwareData.attributes,
        )
        const messages = createMessages({
          barcodes: this.barcodeArray,
          response,
          reception: this.reception,
        })

        // we create a different alert for each message
        messages.forEach(({ type, text }) => {
          this.showAlert(text, type)
        })
      } catch (e) {
        console.error(e)
        this.showAlert(e, 'danger')
      }
      this.clearModal()
    },

    async fetchLabware() {
      this.fetchStarted({
        message: `Fetching ${this.barcodeCount} items from ${this.reception.text}`,
      })
      try {
        const { foundBarcodes, attributes } = await this.reception.fetchFunction({
          requests: this.api,
          barcodes: this.barcodeArray,
          requestOptions: this.presentRequestOptions,
        })
        this.labwareData = {
          foundBarcodes,
          attributes,
        }
      } catch (e) {
        console.error(e)
        this.fetchFailed({
          message: e.toString(),
        })
      }
    },
    reset() {
      this.source = 'Sequencescape'
      this.pipeline = 'PacBio'
      this.requestOptions = defaultRequestOptions()
      this.barcodes = ''
      this.resetRequestOptions()
      this.labwareData = {
        foundBarcodes: new Set(),
        attributes: {},
      }
    },
    resetRequestOptions() {
      this.requestOptions = defaultRequestOptions()
    },
  },
}
</script>

<style scoped></style>
