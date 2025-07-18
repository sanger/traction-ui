<template>
  <div class="flex flex-row space-x-12 px-12">
    <loading-full-screen-modal v-bind="modalState"></loading-full-screen-modal>
    <div class="w-1/2">
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
            :options="receptionOptionsList"
            data-type="source-list"
            @update:model-value="updatePipeline()"
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

        <div class="grid grid-cols-2 gab-4 mt-4 mb-4">
          <div>
            <traction-label class="inline-block w-full text-left">Workflow</traction-label>
            <traction-muted-text class=""
              >Select a workflow if you would like to scan in the imported
              labware</traction-muted-text
            >
            <traction-select
              id="workflowSelect"
              v-model="workflow"
              class="mt-1 mr-2"
              :options="workflowOptions"
              data-type="workflow-list"
            />
          </div>
          <!-- Only displaying the swipecard field when the user selects a workflow -->
          <div v-show="workflow">
            <traction-label class="inline-block w-full text-left"
              >User barcode or swipecard</traction-label
            >
            <traction-muted-text class="ml-1 text-left"
              >Only required when a workflow is selected</traction-muted-text
            >
            <traction-field-error
              data-attribute="user-code-error"
              :error="
                !user_code && workflow
                  ? 'User code is required to scan in the imported labware'
                  : ''
              "
            >
              <traction-input
                id="userCode"
                v-model="user_code"
                data-attribute="user-code-input"
                class="mt-1"
                type="password"
              />
            </traction-field-error>
          </div>
        </div>
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
            <DataTypeSelect v-model="requestOptions.data_type" pipeline="ont" />
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
      <component
        :is="reception.barcodeComponent"
        :pipeline="pipeline"
        :reception="reception"
        :request-options="requestOptions"
        :workflow-location-text="
          workflowLocation
            ? `The imported labware will be scanned into ${workflowLocation}`
            : 'No location selected to scan into'
        "
        :user-code="user_code"
        :location-barcode="location_barcode"
        @import-started="importStarted"
        @import-finished="clearModal"
        @reset="reset"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Receptions, { WorkflowsLocations } from '@/lib/receptions'
import TractionHeading from '../components/TractionHeading.vue'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect.vue'
import DataTypeSelect from '@/components/shared/DataTypeSelect.vue'
import { defaultRequestOptions, ReceptionTypes, MockReceptionTypes } from '@/lib/receptions'
import { checkFeatureFlag } from '@/api/FeatureFlag.js'

// We don't expect the modal to display without a message. If we end up in this
// state then something has gone horribly wrong.
const stuckModal =
  "We appear to be stuck, this shouldn't happen. Please contact support, and try reloading the page"
const defaultModal = () => ({ visible: false, message: stuckModal })

// Default source to sequencescape
const source = ref('Sequencescape')
const requestOptions = ref(defaultRequestOptions())
const modalState = ref(defaultModal())

const reception = computed(() => Receptions[source.value])
// Default pipeline to PacBio
const pipeline = ref(reception.value.pipelines[0])
const pipelineOptions = computed(() =>
  reception.value.pipelines.map((pipeline) => ({ value: pipeline, text: pipeline })),
)
const user_code = ref('')

const workflow = ref('')

const receptionOptionsList = ref([])

const workflowOptions = computed(() => [
  { value: '', text: '' }, // Empty option
  ...Object.values(WorkflowsLocations)
    .filter((workflow) => workflow.pipelines.includes(pipeline.value))
    .map((workflow) => ({
      value: workflow.barcode,
      text: workflow.name,
    })),
])

const environment = ref(import.meta.env['VITE_ENVIRONMENT'])

const receptionOptions = async () => {
  let receptionTypes = Object.values(ReceptionTypes)
  const isKinnexEnabled = await checkFeatureFlag('kinnex_sample_reception')
  // Filter out SequencescapeKinnexTubes if the feature flag is not enabled
  if (!isKinnexEnabled) {
    receptionTypes = receptionTypes.filter((type) => type.value !== 'SequencescapeKinnexTubes')
  }
  if (environment.value == 'uat' || environment.value == 'development') {
    return [
      ...receptionTypes,
      { label: 'Mock receptions (UAT only)', options: [...Object.values(MockReceptionTypes)] },
    ]
  }

  return [...receptionTypes]
}
onMounted(async () => {
  receptionOptionsList.value = await receptionOptions()
})

const workflowLocation = computed(() => {
  const workflowsMap = new Map(
    Object.values(WorkflowsLocations).map((workflow) => [workflow.barcode, workflow]),
  )
  if (workflow.value !== '') {
    return workflowsMap.get(workflow.value).location
  }
  return undefined
})

const location_barcode = computed(() => {
  return workflow.value
})

function updatePipeline() {
  // If the current reception doesn't include the current pipeline then update the pipeline to a valid one
  if (!reception.value.pipelines.includes(pipeline.value)) {
    pipeline.value = reception.value.pipelines[0]
  }
}

function clearModal() {
  modalState.value = defaultModal()
}

function showModal(message) {
  modalState.value = { visible: true, message }
}

function importStarted({ barcode_count }) {
  showModal(`Creating ${barcode_count} labware(s) for ${reception.value.text}`)
}

function reset() {
  source.value = 'Sequencescape'
  pipeline.value = 'PacBio'
  resetRequestOptions()
}

function resetRequestOptions() {
  requestOptions.value = defaultRequestOptions()
}
</script>
