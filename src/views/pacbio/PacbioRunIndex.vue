<template>
  <div>
    <alert ref="alert"></alert>

    <b-form-group
      label="Filter"
      label-cols-sm="1"
      label-align-sm="right"
      label-for="filterInput"
      class="mb-0"
    >
      <b-input-group>
        <b-form-input id="filterInput" v-model="filter" type="search" placeholder="Type to Search">
        </b-form-input>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <br />

    <b-table
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
      <template v-slot:cell(actions)="row">
        <b-button
          :id="generateId('startRun', row.item.id)"
          variant="outline-success"
          size="sm"
          class="mr-1"
          :disabled="row.item.state !== 'pending'"
          @click="updateRun('start', row.item.id)"
        >
          Start
        </b-button>

        <b-button
          :id="generateId('completeRun', row.item.id)"
          variant="outline-primary"
          size="sm"
          class="mr-1"
          :disabled="isRunDisabled(row.item)"
          @click="updateRun('complete', row.item.id)"
        >
          Complete
        </b-button>

        <b-button
          :id="generateId('cancelRun', row.item.id)"
          variant="outline-danger"
          size="sm"
          class="mr-1"
          :disabled="isRunDisabled(row.item)"
          @click="updateRun('cancel', row.item.id)"
        >
          Cancel
        </b-button>

        <b-button
          :id="generateId('editRun', row.item.id)"
          variant="outline-info"
          size="sm"
          class="mr-1"
          @click="redirectToRun(row.item.id)"
        >
          Edit
        </b-button>

        <a
          v-show="row.item.all_wells_have_libraries"
          :id="generateId('generate-sample-sheet', row.item.id)"
          :href="generateSampleSheetPath(row.item.id)"
          class="text-primary"
        >
          Generate Sample Sheet
        </a>
      </template>
    </b-table>

    <span class="font-weight-bold">Total records: {{ runs.length }}</span>

    <div class="clearfix">
      <b-button id="newRun" class="float-left" variant="success" @click="redirectToRun()">
        New Run
      </b-button>

      <b-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="runs.length"
        :per-page="perPage"
        aria-controls="run-index"
      >
      </b-pagination>
    </div>
    <b-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <b-form-input id="input-per-page" v-model="perPage" trim class="w-25"></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PacbioRuns',
  components: {
    Alert,
  },
  mixins: [Helper, TableHelper],
  data() {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true, tdClass: 'run-id' },
        { key: 'name', label: 'Name', sortable: true, tdClass: 'name' },
        { key: 'state', label: 'State', sortable: true, tdClass: 'state' },
        {
          key: 'binding_kit_box_barcode',
          label: 'Binding Kit BB',
          sortable: true,
          tdClass: 'binding-kit-box-barcode',
        },
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
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 6,
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runs', ['runs']),
  },
  created() {
    this.provider()
  },
  methods: {
    async provider() {
      try {
        await this.setRuns()
      } catch (error) {
        this.showAlert('Failed to get runs: ' + error.message, 'danger')
      }
    },
    isRunDisabled(run) {
      return run.state == 'completed' || run.state == 'cancelled' || run.state == 'pending'
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    generateSampleSheetPath(id) {
      return process.env.VUE_APP_TRACTION_BASE_URL + '/v1/pacbio/runs/' + id + '/sample_sheet'
    },
    updateRun(status, id) {
      try {
        this[status + 'Run'](id)
      } catch (error) {
        this.showAlert('Failed to update run: ' + error.message, 'danger')
      }
    },
    redirectToRun(runId) {
      this.$router.push({ path: `/pacbio/run/${runId || 'new'}` })
    },
    ...mapActions('traction/pacbio/runs', ['setRuns', 'generateSampleSheet']),
    ...mapActions('traction', ['startRun', 'completeRun', 'cancelRun']),
  },
}
</script>

<style></style>
