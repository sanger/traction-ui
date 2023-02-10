<template>
  <flagged-feature name="dpl_281_ont_create_sequencing_runs">
    <DataFetcher :fetcher="fetchOntRuns">
      <div class="clearfix">
        <traction-pagination
          v-model="currentPage"
          class="float-right"
          :total-rows="runs.length"
          :per-page="perPage"
          aria-controls="run-index"
        ></traction-pagination>

        <traction-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
          <traction-input id="input-per-page" v-model="perPage" trim class="w-25"></traction-input>
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
        tbody-tr-class="run"
        :per-page="perPage"
        :current-page="currentPage"
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
    </DataFetcher>
  </flagged-feature>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import DataFetcher from '@/components/DataFetcher.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/ont')

export default {
  name: 'ONTRuns',
  components: {
    DataFetcher,
  },
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true, tdClass: 'run-id' },
        {
          key: 'experiment_name',
          label: 'Experiment ID',
          sortable: true,
          tdClass: 'experiment-name',
        },
        { key: 'state', label: 'State', sortable: true, tdClass: 'state' },
        {
          key: 'instrument_name',
          label: 'Instrument Name',
          sortable: true,
          tdClass: 'instrument-name',
        },
        { key: 'created_at', label: 'Created at', sortable: true, tdClass: 'created-at' },
        { key: 'actions', label: 'Actions', tdClass: 'actions' },
      ],
      sortBy: 'created_at',
      sortDesc: true,
      currentPage: 1,
      perPage: 25,
    }
  },
  computed: {
    ...mapGetters(['runs']),
  },
  methods: {
    generateId(text, id) {
      return `${text}-${id}`
    },
    redirectToRun(runId) {
      this.$router.push({ path: `/ont/run/${runId || 'new'}` })
    },
    ...mapActions(['fetchOntRuns']),
  },
}
</script>

<style></style>
