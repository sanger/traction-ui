<template>
  <DataFetcher :fetcher="fetchOntRequests">
    <FilterCard :fetcher="fetchOntRequests" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination
          v-model="currentPage"
          class="float-right"
          :total-rows="requests.length"
          :per-page="perPage"
          aria-controls="samples-table"
          @input="onPageChange($event)"
        >
        </traction-pagination>
      </div>

      <traction-table
        id="samples-table"
        :items="tableData"
        :fields="fields"
        :sort-by.sync="sortBy"
        selectable
        select-mode="single"
        @filtered="onFiltered"
        @row-selected="onRowSelected"
      >
        <template #cell(selected)="selectedCell">
          <template v-if="selectedCell.selected">
            <span>&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span>&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import { createNamespacedHelpers } from 'vuex'
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
// TODO: Move these actions back to top level store.
const { mapActions, mapGetters } = createNamespacedHelpers('traction/ont/pools')

export default {
  name: 'OntSampleIndex',
  components: {
    DataFetcher,
    FilterCard,
  },
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'selected', label: '\u2713' },
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'source_identifier', label: 'Source', sortable: true },
        { key: 'sample_name', label: 'Sample Name', sortable: true },
        { key: 'library_type', label: 'Library type' },
        { key: 'data_type', label: 'Data type' },
        {
          key: 'number_of_flowcells',
          label: 'Number of flowcells',
        },
        { key: 'cost_code', label: 'Cost code' },
        { key: 'external_study_id', label: 'External study ID' },
        { key: 'created_at', label: 'Created at (UTC)', sortable: true },
      ],
      filterOptions: [
        { value: '', text: '' },
        { value: 'id', text: 'Sample ID (Request)' },
        { value: 'source_identifier', text: 'Source barcode' },
        { value: 'sample_name', text: 'Sample name' },
        // Need to specify filters in json api resources if we want more filters
      ],
      filteredItems: [],
      selected: [],
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 25,
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters(['requests']),
  },
  watch: {
    requests(newValue) {
      this.setInitialData(newValue, this.perPage, { sortBy: 'created_at' })
    },
  },
  methods: {
    ...mapActions(['fetchOntRequests']),
  },
}
</script>
