<template>
  <DataFetcher :fetcher="fetchOntRuns">
    <div class="flex flex-col">
      <div class="clearfix mt-5">
        <traction-button id="newRun" class="float-left" theme="create" @click="redirectToRun()">
          New Run
        </traction-button>
        <span class="font-weight-bold">Total records: {{ runs.length }}</span>
        <traction-pagination
          v-model="currentPage"
          class="float-right"
          :total-rows="runs.length"
          :per-page="perPage"
          aria-controls="run-index"
          @update:modelValue="onPageChange($event)"
        ></traction-pagination>
      </div>

      <traction-table id="run-index" v-model:sort-by="sortBy" :items="tableData" :fields="fields">
        <template #cell(actions)="row">
          <traction-button
            :id="generateId('editRun', row.item.id)"
            theme="edit"
            size="sm"
            class="mr-1"
            @click="redirectToRun(row.item.id)"
            >Edit</traction-button
          >
          <a
            :id="generateId('sample-sheet', row.item.id)"
            :href="generateSampleSheetPath(row.item.id)"
            class="text-primary p-1 mr-1 whitespace-nowrap"
          >
            <traction-button
              :id="generateId('generate-sample-sheet', row.item.id)"
              class="bg-sp-400 hover:bg-sp-300"
            >
              Sample Sheet <DownloadIcon class="pl-1" />
            </traction-button>
          </a>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import DataFetcher from '@/components/DataFetcher.vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/ont')

export default {
  name: 'ONTRuns',
  components: {
    DataFetcher,
    DownloadIcon,
  },
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true },
        {
          key: 'experiment_name',
          label: 'Experiment ID',
          sortable: true,
          tdClass: 'experiment-name',
        },
        { key: 'state', label: 'State', sortable: true },
        {
          key: 'instrument_name',
          label: 'Instrument Name',
          sortable: true,
          tdClass: 'instrument-name',
        },
        { key: 'created_at', label: 'Created at (UTC)', sortable: true },
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
  watch: {
    runs(newValue) {
      this.setInitialData(newValue, this.perPage, { sortBy: 'created_at' })
    },
  },
  methods: {
    generateId(text, id) {
      return `${text}-${id}`
    },
    generateSampleSheetPath(id) {
      return import.meta.env.VITE_TRACTION_BASE_URL + `/v1/ont/runs/${id}/sample_sheet`
    },
    redirectToRun(runId) {
      this.$router.push({ path: `/ont/run/${runId || 'new'}` })
    },
    ...mapActions(['fetchOntRuns']),
  },
}
</script>

<style></style>
