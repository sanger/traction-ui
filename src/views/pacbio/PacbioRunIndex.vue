<template>
  <DataFetcher :fetcher="fetchRuns">
    <FilterCard :fetcher="fetchRuns" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
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

      <traction-table id="run-index" v-model:sort-by="sortBy" :items="runsArray" :fields="fields">
        <template #cell(sequencing_kit_box_barcodes)="row">
          <ul>
            <li v-for="barcode in row.item.sequencing_kit_box_barcodes" :key="barcode">
              {{ barcode }}
            </li>
          </ul>
        </template>

        <template #cell(system_name_and_version)="row">
          <div class="flex justify-between gap-1">
            <span class="grow">{{ row.item.system_name }}</span>
            <traction-badge :colour="generateVersionColour(row.item.pacbio_smrt_link_version_id)">
              {{ getVersionName(row.item.pacbio_smrt_link_version_id).split('_')[0] }}
            </traction-badge>
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

<script>
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import TractionBadge from '@/components/shared/TractionBadge.vue'
import useQueryParams from '@/composables/useQueryParams.js'
import { usePacbioRunsStore } from '@/stores/pacbioRuns.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'
import { mapActions as mapActionsPinia, mapState } from 'pinia'

export default {
  name: 'PacbioRuns',
  components: {
    DataFetcher,
    FilterCard,
    DownloadIcon,
    TractionBadge,
  },
  setup() {
    const { fetchWithQueryParams } = useQueryParams()
    return { fetchWithQueryParams }
  },
  data() {
    return {
      fields: [
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
        { key: 'created_at', label: 'Created at (UTC)', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      filterOptions: [
        { value: '', text: '' },
        { value: 'name', text: 'Name' },
        { value: 'state', text: 'State' },
        // Need to specify filters in json api resources if we want more filters
      ],
      sortBy: 'created_at',
      sortDesc: true,
    }
  },
  computed: {
    ...mapState(usePacbioRunsStore, ['runsArray']),
    ...mapState(usePacbioRunCreateStore, ['smrtLinkVersionList']),
  },
  methods: {
    getVersionName(versionId) {
      return this.smrtLinkVersionList[versionId]?.name || '< ! >'
    },
    isRunDisabled(run) {
      return run.state == 'completed' || run.state == 'cancelled' || run.state == 'pending'
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    generateSampleSheetPath(id) {
      return import.meta.env.VITE_TRACTION_BASE_URL + '/v1/pacbio/runs/' + id + '/sample_sheet'
    },
    generateVersionColour(versionIndex) {
      const colours = TractionBadge.colours.spectrum
      const colourIndex = versionIndex % colours.length
      return colours[colourIndex]
    },
    updateRunState(status, id) {
      try {
        this.updateRun({ id, state: status })
      } catch (error) {
        this.showAlert('Failed to update run: ' + error.message, 'danger')
      }
    },
    redirectToRun(runId) {
      this.$router.push({ path: `/pacbio/run/${runId || 'new'}` })
    },
    ...mapActionsPinia(usePacbioRunsStore, ['fetchPacbioRuns', 'updateRun']),
    ...mapActionsPinia(usePacbioRunCreateStore, ['fetchSmrtLinkVersions']),
    async fetchRuns() {
      this.smrtLinkVersionList.length ? null : await this.fetchSmrtLinkVersions()
      return await this.fetchWithQueryParams(this.fetchPacbioRuns, this.filterOptions)
    },
    async downloadCSV({ id, name }) {
      const response = await fetch(this.generateSampleSheetPath(id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/csv',
        },
      })
      // The response may be invalid if an unsupported version is requested
      // Or if an unexpected error occurs. This response will be in json format
      if (!response.ok) {
        const json_error = await response.json()
        this.showAlert(json_error['error'], 'danger')
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
    },
  },
}
</script>
