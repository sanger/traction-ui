<template>
  <div>
    <traction-table id="runs-table" v-model:sort-by="sortBy" :items="runs" :fields="fields">
      <template #cell(chip_barcode)="row">
        {{ truncateText(row.item.chip_barcode, 40) }}
      </template>

      <template #cell(actions)="row">
        <traction-button
          :id="generateId('edit', row.item.id)"
          theme="edit"
          size="sm"
          class="mr-1"
          @click="redirectToRun(row.item.id)"
        >
          Edit
        </traction-button>

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
      </template>
    </traction-table>

    <span class="font-weight-bold">Total records: {{ runs.length }}</span>

    <div class="clearfix">
      <traction-button id="newRun" class="float-left" theme="create" @click="redirectToRun()">
        New Run
      </traction-button>
    </div>
  </div>
</template>

<script>
import truncate from 'lodash-es/truncate'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SaphyrRuns',
  props: {},
  data() {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        { key: 'chip_barcode', label: 'Chip Barcode', sortable: true },
        { key: 'created_at', label: 'Created at (UTC)', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      sortBy: 'created_at',
      sortDesc: true,
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
