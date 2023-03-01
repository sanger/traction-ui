<template>
  <DataFetcher :fetcher="fetchPacbioRuns">
    <FilterCard :fetcher="fetchPacbioRuns" :filter-options="filterOptions" />
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
      >
      </traction-pagination>
      <traction-form-group
        class="float-right mx-5"
        label-cols-lg="4"
        label="Per Page"
        label-for="input-per-page"
      >
        <traction-input
          id="input-per-page"
          v-model="perPage"
          trim
          class="w-full w-25"
        ></traction-input>
      </traction-form-group>
    </div>

    <traction-table
      id="run-index"
      hover
      responsive
      show-empty
      small
      :items="runs"
      :fields="fields"
      :filter="filter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :per-page="perPage"
      :current-page="currentPage"
      tbody-tr-class="run"
      @filtered="onFiltered"
    >
      <template #cell(actions)="row">
        <traction-button
          :id="generateId('startRun', row.item.id)"
          theme="create"
          size="sm"
          class="mr-1"
          :disabled="row.item.state !== 'pending'"
          @click="updateRun('start', row.item.id)"
        >
          Start
        </traction-button>

        <traction-button
          :id="generateId('completeRun', row.item.id)"
          theme="update"
          size="sm"
          class="mr-1"
          :disabled="isRunDisabled(row.item)"
          @click="updateRun('complete', row.item.id)"
        >
          Complete
        </traction-button>

        <traction-button
          :id="generateId('cancelRun', row.item.id)"
          theme="delete"
          size="sm"
          class="mr-1"
          :disabled="isRunDisabled(row.item)"
          @click="updateRun('cancel', row.item.id)"
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
          v-show="row.item.all_wells_have_pools"
          :id="generateId('generate-sample-sheet', row.item.id)"
          :href="generateSampleSheetPath(row.item.id)"
          class="text-primary"
        >
          Generate Sample Sheet
        </a>
      </template>
    </traction-table>
  </DataFetcher>
</template>

<script>
import DataFetcher from '@/components/DataFetcher'
import FilterCard from '@/components/FilterCard'
import TableHelper from '@/mixins/TableHelper'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PacbioRuns',
  components: {
    DataFetcher,
    FilterCard,
  },
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true, tdClass: 'run-id' },
        { key: 'name', label: 'Name', sortable: true, tdClass: 'name' },
        { key: 'state', label: 'State', sortable: true, tdClass: 'state' },
        {
          key: 'sequencing_kit_box_barcode',
          label: 'Sequencing Kit BB',
          sortable: true,
          tdClass: 'sequencing-kit-box-barcode',
        },
        {
          key: 'dna_control_complex_box_barcode',
          label: 'DNA Control Complex BB',
          sortable: true,
          tdClass: 'dna-control-complex-box-barcode',
        },
        { key: 'system_name', label: 'System Name', sortable: true, tdClass: 'system-name' },
        { key: 'created_at', label: 'Created at', sortable: true },
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
    updateRun(status, id) {
      try {
        this[status + 'Run']({ id, pipeline: 'pacbio' })
      } catch (error) {
        this.showAlert('Failed to update run: ' + error.message, 'danger')
      }
    },
    redirectToRun(runId) {
      this.$router.push({ path: `/pacbio/run/${runId || 'new'}` })
    },

    ...mapActions('traction/pacbio/runs', ['fetchPacbioRuns', 'generateSampleSheet']),
    ...mapActions('traction', ['startRun', 'completeRun', 'cancelRun']),
  },
}
</script>
