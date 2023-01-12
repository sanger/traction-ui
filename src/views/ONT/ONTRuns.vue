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
    ></traction-table>

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
        { key: 'experiment_name', label: 'Name', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        {
          key: 'instrument_name',
          label: 'Instrument Name',
          sortable: true,
        },
        { key: 'created_at', label: 'Created at', sortable: true },
      ],
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
        // setRuns is currently mocking the data, until backend is complete
        await this.setRuns()
      } catch (error) {
        this.showAlert('Failed to get runs: ' + error.message, 'danger')
      }
    },
    redirectToRun() {
      this.$router.push({ path: '/ont/run/new' })
    },
    ...mapActions('traction/ont/runs', ['setRuns']),
  },
}
</script>

<style></style>
