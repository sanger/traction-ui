<template>
  <DataFetcher :fetcher="provider">
    <FilterCard :fetcher="provider" :filter-options="filterOptions" />
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
        <traction-pagination
          v-model="currentPage"
          class="float-right"
          :total-rows="runs.length"
          :per-page="perPage"
          aria-controls="run-index"
          @update:modelValue="onPageChange($event)"
        >
        </traction-pagination>
      </div>

      <traction-table
        id="run-index"
        v-model:sort-by="sortBy"
        :items="tableData"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        @filtered="onFiltered"
      >
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
            <traction-badge :color="generateVersionColour(row.item.pacbio_smrt_link_version_id)">
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

          <a
            :id="generateId('generate-sample-sheet', row.item.id)"
            :href="generateSampleSheetPath(row.item.id)"
            class="text-primary"
          >
            <traction-button
              :id="generateId('generate-sample-sheet', row.item.id)"
              class="bg-sp-400 hover:bg-sp-300"
            >
              Generate Sample Sheet <DownloadIcon class="pl-1" />
            </traction-button>
          </a>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script>
import DataFetcher from '@/components/DataFetcher'
import FilterCard from '@/components/FilterCard'
import TableHelper from '@/mixins/TableHelper'
import { mapActions, mapGetters } from 'vuex'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import TractionBadge from '@/components/shared/TractionBadge.vue'

export default {
  name: 'PacbioRuns',
  components: {
    DataFetcher,
    FilterCard,
    DownloadIcon,
    TractionBadge,
  },
  mixins: [TableHelper],
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
      filteredItems: [],
      filterOptions: [
        { value: '', text: '' },
        { value: 'name', text: 'Name' },
        { value: 'state', text: 'State' },
        // Need to specify filters in json api resources if we want more filters
      ],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 25,
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runs', ['runs']),
    ...mapGetters('traction/pacbio/runCreate', ['smrtLinkVersionList']),
  },
  watch: {
    runs(newValue) {
      this.setInitialData(newValue, this.perPage, { sortBy: 'created_at' })
    },
  },
  methods: {
    getVersionName(versionId) {
      return this.smrtLinkVersionList[versionId].name
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
      // colours used in TractionBadge
      const colours = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink']
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
    ...mapActions('traction/pacbio/runs', ['fetchPacbioRuns', 'updateRun']),
    ...mapActions('traction/pacbio/runCreate', ['fetchSmrtLinkVersions']),
    async provider() {
      // Seeds required data and loads the page via the DataFetcher
      let requiredSucceeds = true
      const errorList = []
      const fetchers = {
        // the keys are used in the error message should the fetcher fail
        'PacBio Runs': { fetcher: this.fetchPacbioRuns, required: true },
        'SMRT-Link Versions': { fetcher: this.fetchSmrtLinkVersions, required: false },
      }
      // Fetch data in parallel
      const fetchPromises = Object.entries(fetchers).map(([name, { fetcher, required }]) => {
        return fetcher().then((res) => {
          if (!res.success) {
            errorList.push(name)
            if (required) requiredSucceeds = false
          }
        })
      })
      await Promise.all(fetchPromises)
      if (requiredSucceeds) {
        return { success: true }
      }

      const errors = 'Failed to fetch ' + errorList.join(', ')
      return { success: false, errors }
    },
  },
}
</script>
