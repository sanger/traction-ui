<template>
  <DataFetcher :fetcher="fetchPacbioRuns">
    <FilterCard :fetcher="fetchPacbioRuns" :filter-options="filterOptions" />
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
          @input="onPageChange($event)"
        >
        </traction-pagination>
      </div>

      <traction-table
        id="run-index"
        :items="tableData"
        :fields="fields"
        :sort-by.sync="sortBy"
        :per-page="perPage"
        :current-page="currentPage"
        @filtered="onFiltered"
      >
        <template #cell(actions)="row">
          <traction-button
            :id="generateId('startRun', row.item.id)"
            theme="create"
            size="sm"
            class="mr-1"
            :disabled="row.item.state !== 'pending'"
            @click="updateRunState('started', row.item.id)"
          >
            Start
          </traction-button>

          <traction-button
            :id="generateId('completeRun', row.item.id)"
            theme="update"
            size="sm"
            class="mr-1"
            :disabled="isRunDisabled(row.item)"
            @click="updateRunState('completed', row.item.id)"
          >
            Complete
          </traction-button>

          <traction-button
            :id="generateId('cancelRun', row.item.id)"
            theme="delete"
            size="sm"
            class="mr-1"
            :disabled="isRunDisabled(row.item)"
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

export default {
  name: 'PacbioRuns',
  components: {
    DataFetcher,
    FilterCard,
    DownloadIcon,
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
        { key: 'system_name', label: 'System Name', sortable: true },
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
  },
  watch: {
    runs(newValue) {
      this.setInitialData(newValue, this.perPage, { sortBy: 'created_at' })
    },
  },
  methods: {
    isRunDisabled(run) {
      return run.state == 'completed' || run.state == 'cancelled' || run.state == 'pending'
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    generateSampleSheetPath(id) {
      return import.meta.env.VITE_TRACTION_BASE_URL + '/v1/pacbio/runs/' + id + '/sample_sheet'
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
  },
}
</script>
