<template>
  <div>
    <traction-table
      id="run-index"
      hover
      responsive
      show-empty
      small
      :items="runs"
      :fields="fields"
      tbody-tr-class="run"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template #cell(actions)="row">
        <traction-button
          :id="generateId('editRun', row.item.id)"
          theme="edit"
          size="sm"
          class="mr-1"
          @click="redirectToRun(row.item.id)"
          >Edit</traction-button
        >
      </template>
    </traction-table>

    <span class="font-weight-bold">Total records: {{ runs.length }}</span>

    <div class="clearfix">
      <traction-button id="newRun" class="float-left" theme="create" @click="redirectToRun()"
        >New Run</traction-button
      >
    </div>
  </div>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ONTRuns',
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true },
        { key: 'experiment_name', label: 'Experiment ID', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        {
          key: 'instrument_name',
          label: 'Instrument Name',
          sortable: true,
        },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      sortBy: 'created_at',
      sortDesc: true,
    }
  },
  computed: {
    ...mapGetters('traction/ont/runs', ['runs']),
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
    generateId(text, id) {
      return `${text}-${id}`
    },
    redirectToRun(runId) {
      this.$router.push({ path: `/ont/run/${runId || 'new'}` })
    },
    ...mapActions('traction/ont/runs', ['setRuns']),
  },
}
</script>

<style></style>
