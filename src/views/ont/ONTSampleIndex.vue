<template>
  <DataFetcher :fetcher="fetchRequests">
    <FilterCard :fetcher="fetchRequests" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination
          class="float-right"
          aria-controls="samples-table"
        ></traction-pagination>
      </div>

      <traction-table
        id="samples-table"
        v-model:sort-by="sortBy"
        :items="displayedRequests"
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
import { ref } from 'vue'
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import useQueryParams from '@/composables/useQueryParams.js'
import useLocationFetcher from '@/composables/useLocationFetcher.js'
import { formatRequests } from '@/lib/requestHelpers'

const { mapActions, mapGetters } = createNamespacedHelpers('traction/ont/pools')

export default {
  name: 'OntSampleIndex',
  components: {
    DataFetcher,
    FilterCard,
  },
  setup() {
    const { fetchWithQueryParams } = useQueryParams()
    const { fetchLocations } = useLocationFetcher()
    const labwareLocations = ref([])

    return { fetchWithQueryParams, fetchLocations, labwareLocations }
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
        { key: 'location', label: 'Location', sortable: true },
        { key: 'sample_retention_instruction', label: 'Retention Instruction', sortable: true },
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
    }
  },
  computed: {
    ...mapGetters(['requests']),
    barcodes() {
      return this.requests.map(({ source_identifier }) => source_identifier)
    },
    // Computed property to return updated displayed requests
    displayedRequests() {
      return formatRequests(this.requests, this.labwareLocations.value)
    },
  },
  watch: {
    // Watch for changes to the barcodes and fetch locations accordingly
    barcodes: {
      handler: async function (newBarcodes) {
        this.labwareLocations.value = await this.fetchLocations(newBarcodes)
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(['fetchOntRequests']),
    async fetchRequests() {
      return await this.fetchWithQueryParams(this.fetchOntRequests, this.filterOptions)
    },
  },
}
</script>
