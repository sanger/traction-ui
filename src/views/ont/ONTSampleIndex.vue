<template>
  <DataFetcher :fetcher="fetchRequests">
    <FilterCard :fetcher="fetchRequests" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination
          class="float-right"
          :total-pages="totalPages"
          :fetcher="fetchRequests"
          aria-controls="samples-table"
        >
        </traction-pagination>
      </div>

      <traction-table
        id="samples-table"
        v-model:sort-by="sortBy"
        :items="requests"
        :fields="fields"
        selectable
        select-mode="single"
        @row-selected="(items) => (selected = items)"
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
import { createNamespacedHelpers } from 'vuex'
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import useQueryParams from '@/lib/QueryParamsHelper'
// TODO: Move these actions back to top level store.
const { mapActions, mapGetters } = createNamespacedHelpers('traction/ont/pools')

export default {
  name: 'OntSampleIndex',
  components: {
    DataFetcher,
    FilterCard,
  },
  setup() {
    const { filter_value, filter_input, filter_wildcard, page_size, page_number } = useQueryParams()
    return { filter_value, filter_input, filter_wildcard, page_size, page_number }
  },
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
      selected: [],
      sortBy: 'created_at',
      sortDesc: true,
      totalPages: 1,
    }
  },
  computed: {
    ...mapGetters(['requests']),
  },
  methods: {
    ...mapActions(['fetchOntRequests']),
    async fetchRequests() {
      const page = { size: this.page_size.toString(), number: this.page_number.toString() }
      const filter =
        !this.filter_value || !this.filter_input ? {} : { [this.filter_value]: this.filter_input }
      const { success, errors, meta } = await this.fetchOntRequests({ page: page, filter: filter })
      this.totalPages = meta.page_count
      return { success, errors }
    },
  },
}
</script>
