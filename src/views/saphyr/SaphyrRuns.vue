<template>
  <div>
    <traction-form-group
      label="Filter"
      label-cols-sm="1"
      label-align-sm="right"
      label-for="filterInput"
      class="mb-0"
    >
      <traction-input-group>
        <traction-input
          id="filterInput"
          v-model="filter"
          type="search"
          placeholder="Type to Search"
        >
        </traction-input>
        <traction-input-group-append>
          <traction-button :disabled="!filter" @click="filter = ''">Clear</traction-button>
        </traction-input-group-append>
      </traction-input-group>
    </traction-form-group>
    <br />

    <traction-table
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
      <template #cell(chip_barcode)="data">
        {{ truncateText(data.value, 40) }}
      </template>

      <template #cell(actions)="row">
        <traction-button
          :id="generateId('edit', row.item.id)"
          variant="outline-dark"
          size="sm"
          class="mr-1"
          @click="redirectToRun(row.item.id)"
        >
          Edit
        </traction-button>

        <traction-button
          :id="generateId('startRun', row.item.id)"
          variant="outline-success"
          size="sm"
          class="mr-1"
          :disabled="row.item.state !== 'pending'"
          @click="updateRun('start', row.item.id)"
        >
          Start
        </traction-button>

        <traction-button
          :id="generateId('completeRun', row.item.id)"
          variant="outline-primary"
          size="sm"
          class="mr-1"
          :disabled="isRunDisabled(row.item)"
          @click="updateRun('complete', row.item.id)"
        >
          Complete
        </traction-button>

        <traction-button
          :id="generateId('cancelRun', row.item.id)"
          variant="outline-danger"
          size="sm"
          class="mr-1"
          :disabled="isRunDisabled(row.item)"
          @click="updateRun('cancel', row.item.id)"
        >
          Cancel
        </traction-button>
      </template>
    </traction-table>

    <span class="font-weight-bold">Total records: {{ runs.length }}</span>

    <div class="clearfix">
      <traction-button id="newRun" class="float-left" variant="success" @click="redirectToRun()">
        New Run
      </traction-button>
      <traction-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="runs.length"
        :per-page="perPage"
        aria-controls="libraries-table"
      >
      </traction-pagination>
    </div>
    <traction-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <traction-input id="input-per-page" v-model="perPage" trim class="w-25"></traction-input>
    </traction-form-group>
  </div>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import truncate from 'lodash-es/truncate'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SaphyrRuns',
  mixins: [TableHelper],
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
        this[status + 'Run']({ id, pipeline: 'saphyr' })
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
