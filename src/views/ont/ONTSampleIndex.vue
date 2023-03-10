<template>
  <DataFetcher :fetcher="fetchOntRequests">
    <FilterCard :fetcher="fetchOntRequests" :filter-options="filterOptions" />
    <div class="clearfix">
      <traction-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="requests.length"
        :per-page="perPage"
        aria-controls="samples-table"
        @input="onPageChange($event, perPage)"
      >
      </traction-pagination>
      <traction-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
        <traction-input id="input-per-page" v-model="perPage" trim class="w-25"></traction-input>
      </traction-form-group>
    </div>

    <traction-table
      id="samples-table"
      show-empty
      responsive
      :items="tableData"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      selectable
      select-mode="single"
      tbody-tr-class="sample"
      @filtered="onFiltered"
      @row-selected="onRowSelected"
    >
      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span>&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span>&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>
    </traction-table>
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
        { key: 'selected', label: '' },
        { key: 'id', label: 'Sample ID (Request)', sortable: true, tdClass: 'id' },
        { key: 'source_identifier', label: 'Source', sortable: true, tdClass: 'source_identifier' },
        { key: 'sample_name', label: 'Sample Name', sortable: true, tdClass: 'sample_name' },
        { key: 'library_type', label: 'Library type', tdClass: 'library_type' },
        { key: 'data_type', label: 'Data type', tdClass: 'data_type' },
        {
          key: 'number_of_flowcells',
          label: 'Number of flowcells',
          tdClass: 'number_of_flowcells',
        },
        { key: 'cost_code', label: 'Cost code', tdClass: 'cost_code' },
        { key: 'external_study_id', label: 'External study ID', tdClass: 'external_study_id' },
        { key: 'created_at', label: 'Created at', sortable: true, tdClass: 'created_at' },
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
      this.setInitialData(newValue)
    },
  },
  methods: {
    ...mapActions(['fetchOntRequests']),
  },
}
</script>
