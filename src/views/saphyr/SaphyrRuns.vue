<template>
  <div>
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
      id="runs-table"
      hover
      responsive
      show-empty
      :items="runs"
      :fields="fields"
      :filter="filter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :per-page="perPage"
      :current-page="currentPage"
      @filtered="onFiltered"
    >
      <template v-slot:cell(chip_barcode)="data">
        {{ truncateText(data.value, 40) }}
      </template>

      <template v-slot:cell(actions)="row">
        <b-button
          :id="generateId('edit', row.item.id)"
          variant="outline-dark"
          size="sm"
          class="mr-1"
          @click="redirectToRun(row.item.id)"
        >
          Edit
        </b-button>

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
        aria-controls="libraries-table"
      >
      </b-pagination>
    </div>
    <b-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <b-form-input id="input-per-page" v-model="perPage" trim class="w-25"></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import truncate from 'lodash-es/truncate'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SaphyrRuns',
  mixins: [Helper, TableHelper],
  props: {},
  data() {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        { key: 'chip_barcode', label: 'Chip Barcode', sortable: true },
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
    ...mapGetters('traction/saphyr/runs', ['runs']),
  },
  created() {
    this.provider()
  },
  methods: {
    isRunDisabled(run) {
      return run.state == 'completed' || run.state == 'cancelled'
    },
    isRunPending(run) {
      return run.state !== 'pending'
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    truncateText(text, chars) {
      return truncate(text, { length: chars })
    },
    updateRun(status, id) {
      try {
        this[status + 'Run'](id)
        this.provider()
      } catch (error) {
        this.showAlert('Failed to update run: ' + error.message, 'danger')
      }
    },
    redirectToRun(runId) {
      this.$router.push({ path: `/saphyr/run/${runId || 'new'}` })
    },
    async provider() {
      try {
        await this.setRuns()
      } catch (error) {
        this.showAlert('Failed to get runs: ' + error.message, 'danger')
      }
    },
    ...mapActions('traction/saphyr/runs', ['setRuns']),
    ...mapActions('traction', ['startRun', 'completeRun', 'cancelRun']),
  },
}
</script>
