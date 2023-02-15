<template>
  <flagged-feature name="dpl_277_enable_general_reception">
    <div class="flex flex-row space-x-12 px-12">
      <div class="w-1/2 space-y-12">
        <div>
          <traction-heading level="4" :show-border="true"> Source </traction-heading>
          <traction-muted-text class="float-left"
            >The location to import the labware from
          </traction-muted-text>
          <traction-select id="sourceSelect" class="mt-2" v-model="source" :options="receptions" />
        </div>

        <div>
          <traction-heading level="4" :show-border="true">Scan barcodes</traction-heading>
          <traction-muted-text class="float-left"
            >The list of labware barcodes to import from source</traction-muted-text
          >
          <traction-textarea
            id="barcodes"
            v-model="barcodes"
            placeholder="Scan barcodes to import..."
            rows="4"
            max-rows="10"
            name="barcodes"
            class="text-base mt-2"
          />
        </div>
      </div>
      <div class="w-1/2 space-y-12">
        <div>
          <traction-heading level="4" :show-border="true"> Pipeline </traction-heading>
          <traction-muted-text class="float-left"
            >The Traction pipeline to import the requests into</traction-muted-text
          >
          <traction-select id="sourceSelect" v-model="pipeline" :options="pipelineOptions" />
        </div>
        <div>
          <traction-heading level="4" :show-border="true"> Request Options </traction-heading>
          <traction-muted-text class="float-left"
            >Default values to apply to the imported requests</traction-muted-text
          >
          <div>
            <LibraryTypeSelect
              v-model="requestOptions.library_type"
              :label-cols="0"
              :allow-none="false"
              :import-text="`Import from ${source} (where available)`"
            />
            <traction-field-group label="Cost Code" attribute="cost_code" for="cost_code">
              <traction-input id="cost_code" v-model="requestOptions.cost_code"></traction-input>
            </traction-field-group>
            <div v-if="pipeline == 'PacBio'">
              <traction-field-group
                label="Number of SMRT cells"
                attribute="number_of_smrt_cells"
                for="number_of_smrt_cells"
              >
                <traction-input
                  id="number_of_smrt_cells"
                  v-model="requestOptions.number_of_smrt_cells"
                  type="number"
                  step="1"
                  min="0"
                ></traction-input>
              </traction-field-group>
              <traction-field-group
                label="Number of Gigabases required"
                attribute="estimate_of_gb_required"
                for="estimate_of_gb_required"
              >
                <traction-input
                  id="estimate_of_gb_required"
                  v-model="requestOptions.estimate_of_gb_required"
                  type="number"
                  step="1"
                  min="0"
                ></traction-input>
              </traction-field-group>
            </div>
            <div v-if="pipeline == 'ONT'">
              <traction-field-group label="Data Type" attribute="data_type" for="data_type">
                <DataTypeSelect v-model="requestOptions.data_type" pipeline="ont" />
              </traction-field-group>
              <traction-field-group
                label="Number of Flowcells"
                attribute="number_of_flowcells"
                for="number_of_flowcells"
              >
                <traction-input
                  id="number_of_flowcells"
                  v-model="requestOptions.number_of_flowcells"
                  type="number"
                  step="1"
                  min="0"
                ></traction-input>
              </traction-field-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto max-w-3xl w-1/2 bg-gray-100 rounded p-3">
      <traction-heading level="4" :show-border="true"> Summary </traction-heading>
      <div class="flex flex-col w-full">
        <traction-muted-text class="float-left">Imports data into Traction</traction-muted-text>
        <p class="text-left">
          Import {{ barcodeCount }} labware into {{ pipeline }} from {{ source }}
        </p>
        <div class="flex flex-row space-x-12 mt-5">
          <traction-button
            id="reset"
            fullWidth
            theme="delete"
            @click="importLabware"
          >
            Reset
          </traction-button>
          <traction-button
            id="importLabware"
            :disabled="isDisabled"
            fullWidth
            theme="edit"
            @click="importLabware"
          >
            Import
          </traction-button>
        </div>
      </div>
    </div>
  </flagged-feature>
</template>

<script>
import Api from '@/mixins/Api'
import { createReceptionResource } from '@/services/traction/Reception'
import Receptions from '@/lib/receptions'
import TractionHeading from '../components/TractionHeading.vue'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import DataTypeSelect from '@/components/shared/DataTypeSelect'
import { defaultRequestOptions } from '@/lib/receptions'

const numberRequests = (i) => (i === 1 ? '1 request' : `${i} requests`)

export default {
  components: {
    TractionHeading,
    BarcodeIcon,
    LibraryTypeSelect,
    DataTypeSelect,
  },
  name: 'GeneralReception',
  mixins: [Api],
  props: {
    receptions: {
      type: Array,
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
  }),
  computed: {
    reception: ({ receptions, source }) => receptions.find((r) => r.text == source),
    receptionComponent: ({ reception }) => reception.component,
    receptionOptions: ({ reception }) => reception.props,
    receptionRequest: ({ api }) => api.traction.receptions.create,
    barcodeArray: ({ barcodes }) => barcodes.split(/\s/).filter(Boolean),
    isDisabled: ({ barcodeArray }) => barcodeArray.length === 0,
    barcodeCount: ({ barcodeArray }) => barcodeArray.length,
  },
  methods: {
    importStarted({ message }) {
      this.showModal(message)
    },
    showModal(message) {
      this.modalState = { visible: true, message }
    },
    importFailed({ message }) {
      this.showAlert(message, 'danger')
    },
    async importLoaded({ requestAttributes, source }) {
      this.showModal(`Creating ${numberRequests(requestAttributes.length)} for ${source}`)

      try {
        await createReceptionResource(this.receptionRequest, {
          source: `traction-ui.${source}`,
          requestAttributes,
        })

        this.showAlert(
          `Imported ${numberRequests(requestAttributes.length)} from ${this.reception.name}`,
          'success',
        )
      } catch (e) {
        console.error(e)
        this.showAlert(e, 'danger')
      }
      this.clearModal()
    },

    async importLabware() {
      this.importStarted({ message: `Fetching ${this.barcodeCount} items from ${this.source}` })
      try {
        const response = await this.reception.props.importFunction({
          requests: this.api,
          barcodes: this.barcodeArray,
          requestOptions: this.presentRequestOptions,
        })

        this.importLoaded({
          source: this.source,
          requestAttributes: response.requestAttributes,
        })
      } catch (e) {
        console.error(e)
        this.importFailed({
          message: e.toString(),
        })
      }
    },
  },
}
</script>

<style scoped></style>
