<template>
  <DataFetcher :fetcher="fetchRuns">
    <FilterCard :fetcher="fetchRuns" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div>
        <traction-button
          id="newRun"
          data-action="new-run"
          class="float-left"
          theme="create"
          @click="redirectToRun()"
        >
          New Run
        </traction-button>
        <traction-pagination class="float-right" aria-controls="run-index"> </traction-pagination>
      </div>

      <traction-table
        id="run-index"
        v-model:sort-by="sortBy"
        :items="runsStore.runsArray"
        :fields="fields"
      >
        <template #cell(sequencing_kit_box_barcodes)="row">
          <ul>
            <li
              v-for="barcode in row.item.sequencing_kit_box_barcodes"
              :key="barcode"
              :data-attribute="row.item.id + '-sequencing-kit-bb'"
            >
              {{ barcode }}
            </li>
          </ul>
        </template>

        <template #cell(system_name_and_version)="row">
          <div class="flex items-center">
            <span class="grow">{{ row.item.system_name }}</span>
            <div class="flex-end">
              <traction-badge
                :colour="generateVersionColour(row.item.pacbio_smrt_link_version_id)"
                :data-attribute="'smrt-link-version-badge'"
              >
                {{ versionName(row.item.pacbio_smrt_link_version_id) }}
              </traction-badge>
            </div>
          </div>
        </template>

        <template #cell(actions)="row">
          <traction-button
            v-if="row.item.state == 'pending'"
            :id="generateId('startRun', row.item.id)"
            theme="create"
            size="sm"
            class="mr-1"
            @click="updateRunState('started', row.item.id)"
          >
            Start
          </traction-button>

          <traction-button
            v-if="!isRunDisabled(row.item)"
            :id="generateId('completeRun', row.item.id)"
            theme="update"
            size="sm"
            class="mr-1"
            @click="updateRunState('completed', row.item.id)"
          >
            Complete
          </traction-button>

          <traction-button
            v-if="!isRunDisabled(row.item)"
            :id="generateId('cancelRun', row.item.id)"
            theme="delete"
            size="sm"
            class="mr-1"
            @click="updateRunState('cancelled', row.item.id)"
          >
            Cancel
          </traction-button>

          <traction-button
            :id="generateId('editRun', row.item.id)"
            theme="edit"
            size="sm"
            class="mr-1"
            @click="redirectToRun(row.item.id)"
          >
            Edit
          </traction-button>

          <traction-button
            :id="generateId('generate-sample-sheet', row.item.id)"
            class="bg-sp-400 hover:bg-sp-300"
            @click="downloadCSV({ id: row.item.id, name: row.item.name })"
          >
            Generate Sample Sheet <DownloadIcon class="pl-1" />
          </traction-button>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
/**
 * @name PacbioRunIndex
 * @component The main component for the Pacbio Runs page
 * @description This component is used to display the list of Pacbio Runs using the pacbioRuns Pinia store.
 * It also provides the functionality to start, complete, cancel, edit and generate sample sheet for a run.
 */
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import TractionBadge from '@/components/shared/TractionBadge.vue'
import useQueryParams from '@/composables/useQueryParams.js'
import { usePacbioRunsStore } from '@/stores/pacbioRuns.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { ref } from 'vue'
import useAlert from '@/composables/useAlert'
import { useRouter } from 'vue-router'

// Import the composable functions

/* `fetchWithQueryParams` is a function extracted from the `useQueryParams` composable.
 It's used to fetch data with specified query parameters.*/
const { fetchWithQueryParams } = useQueryParams()

/* `runsStore` is an instance of the PacbioRunsStore. 
 It's used to manage the state and actions related to Pacbio Runs in the application.*/
const runsStore = usePacbioRunsStore()

/*`runCreateStore` is an instance of the PacbioRunCreateStore. 
It's used to manage the state and actions related to creating new Pacbio Runs in the application.*/
const runCreateStore = usePacbioRunCreateStore()

/*`showAlert` is a function extracted from the `useAlert` composable.
It's used to display alert messages in the application*/
const { showAlert } = useAlert()

/*`router` is an instance of the Vue Router.
It's used to navigate between different routes in the application.*/
const router = useRouter()

/*
  The `fields` variable is a reference to an array of objects that define the columns of the table.
  Each object in the array represents a column in the table and has the following properties:
  - `key`: The key to be used for the column data.
  - `label`: The label to be displayed in the column header.
  - `sortable`: A boolean value indicating whether the column is sortable.
*/
const fields = ref([
  { key: 'id', label: 'Run ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'state', label: 'State', sortable: true },
  {
    key: 'dna_control_complex_box_barcode',
    label: 'DNA Control Complex BB',
    sortable: true,
  },
  {
    key: 'sequencing_kit_box_barcodes',
    label: 'Sequencing Kit BB',
    sortable: true,
  },
  { key: 'system_name_and_version', label: 'System & Version', sortable: true },
  {
    key: 'adaptive_loading',
    label: 'Adaptive Loading',
    formatter: (obj) => (obj['adaptive_loading'] ? '✓' : ''),
    sortable: true,
  },
  { key: 'created_at', label: 'Created at (UTC)', sortable: true },
  { key: 'actions', label: 'Actions' },
])

/*
  The `filterOptions` variable is a reference to an array of objects that define the filter options for the table.
  Each object in the array represents a filter option and has the following properties:
  - `value`: The value to be used for the filter.
  - `text`: The text to be displayed for the filter option.
*/
const filterOptions = [
  { value: '', text: '' },
  { value: 'name', text: 'Name' },
  { value: 'state', text: 'State' },
  // Need to specify filters in json api resources if we want more filters
]

/*
  The `sortBy` variable is a reference to a string that defines the default sorting column for the table.
  It is set to 'created_at' by default.
*/
const sortBy = ref('created_at')

/**
 * Returns the name of the SMRT Link version corresponding to the given `versionId` from the `runCreateStore`.
 * If the `versionId` does not exist in the `smrtLinkVersionList` or the corresponding version does not have a name, it returns '< ! >'.
 *
 * @param {string|number} versionId - The ID of the version.
 * @returns {string} The name of the version or '< ! >' if the version does not exist or does not have a name.
 */
const getVersionName = (versionId) => {
  return runCreateStore.smrtLinkVersionList[versionId]?.name || '< ! >'
}

const versionName = (versionId) => {
  const versionName = getVersionName(versionId)
  const match = versionName.match(/^v\d+(_\d+)?/)
  return match ? match[0] : '< ! >'
}
/**
 * Returns a boolean value indicating whether the run is disabled based on its state.
 * A run is disabled if its state is 'completed', 'cancelled', or 'pending'.
 *
 * @param {Object} run - The run object.
 * @param {string} run.state - The state of the run.
 * @returns {boolean} True if the run is disabled, false otherwise.
 */
const isRunDisabled = (run) => {
  return run.state == 'completed' || run.state == 'cancelled' || run.state == 'pending'
}

/**
 * Returns a string that concatenates the `text` and `id` with a hyphen in between.
 *
 * @param {string} text - The text to be concatenated.
 * @param {string|number} id - The ID to be concatenated.
 * @returns {string} The concatenated string.
 */
const generateId = (text, id) => {
  return `${text}-${id}`
}

/**
 * Generates the path to download the sample sheet for the run with the specified `runId`.
 *
 * @param {string|number} id - The ID of the run.
 * @returns {string} The path to download the sample sheet.
 */
const generateSampleSheetPath = (id) => {
  return import.meta.env.VITE_TRACTION_BASE_URL + '/v1/pacbio/runs/' + id + '/sample_sheet'
}

/**
 * Generates a colour for the SMRT Link version based on the `versionIndex`.
 * The colour is selected from the `spectrum` array in the `TractionBadge` component.
 *
 * @param {number} versionIndex - The index of the version.
 * @returns {string} The colour for the version.
 */
const generateVersionColour = (versionIndex) => {
  const colours = TractionBadge.colours.spectrum
  const colourIndex = versionIndex % colours.length
  return colours[colourIndex]
}

/**
 * Updates the state of the run with the specified `id` to the given `status`.
 * If an error occurs while updating the run, it shows an alert message with the error.
 *
 * @param {string} status - The new status for the run.
 * @param {string|number} id - The ID of the run.
 */
const updateRunState = (status, id) => {
  try {
    runsStore.updateRun({ id, state: status })
  } catch (error) {
    showAlert('Failed to update run: ' + error.message, 'danger')
  }
}

/**
 * Redirects to the run page for the specified `runId`.
 * If `runId` is not provided, it redirects to the new run page.
 *
 * @param {string|number} runId - The ID of the run.
 */
const redirectToRun = (runId) => {
  router.push({ path: `/pacbio/run/${runId || 'new'}` })
}

/**
 * Fetches the Pacbio Runs data with the specified query parameters.
 * It uses the `fetchWithQueryParams` function to fetch the data.
 *
 * @returns {Promise} A promise that resolves with the fetched data.
 */
const fetchRuns = async () => {
  runCreateStore.smrtLinkVersionList.length ? null : await runCreateStore.fetchSmrtLinkVersions()
  return await fetchWithQueryParams(runsStore.fetchPacbioRuns, filterOptions)
}

/**
 * Downloads the CSV file for the run with the specified `id` and `name`.
 * If an error occurs while downloading the file, it shows an alert message with the error.
 *
 * @param {Object} param0 - The run object. id and name are required.
 * @param {string|number} param0.id - The ID of the run.
 * @param {string} param0.name - The name of the run.
 */
const downloadCSV = async ({ id, name }) => {
  try {
    const response = await fetch(generateSampleSheetPath(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/csv',
      },
    })
    // The response may be invalid if an unsupported version is requested
    // Or if an unexpected error occurs. This response will be in json format
    if (!response.ok) {
      const json_error = await response.json()
      showAlert(json_error['error'], 'danger')
      return
    }
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    // Creates a temporary dummy link to download the file
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch (err) {
    showAlert(String(err), 'danger')
  }
}
</script>
