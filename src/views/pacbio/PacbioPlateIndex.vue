<template>
  <DataFetcher :fetcher="fetchPlates">
    <FilterCard :fetcher="fetchPlates" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination
          class="float-right"
          :total-pages="totalPages"
          aria-controls="plate-index"
        >
        </traction-pagination>
      </div>

      <traction-table
        id="plate-index"
        v-model:sort-by="sortBy"
        primary_key="id"
        :fields="fields"
        :items="tableData"
        @filtered="onFiltered"
      >
        <template #cell(show_details)="row">
          <traction-button
            :id="'details-btn-' + row.id"
            size="sm"
            theme="default"
            @click="handleTogleDetails(row)"
          >
            {{ row.detailsShowing ? 'Hide' : 'Show' }} Plate
          </traction-button>
        </template>
        <template #row-details="row">
          <Plate
            v-if="currentPlate.id == row.item.id"
            ref="plate"
            :height="row.detailsDim"
            :width="row.detailsDim"
            :plate="currentPlate"
            @alert="alert"
          ></Plate>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import Plate from '@/components/plates/PlateItem'
import FilterCard from '@/components/FilterCard'
import DataFetcher from '@/components/DataFetcher'
import { createNamespacedHelpers } from 'vuex'
import useQueryParams from '@/lib/QueryParamsHelper'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/plates')

export default {
  name: 'PacbioPlates',
  components: {
    Plate,
    FilterCard,
    DataFetcher,
  },
  mixins: [TableHelper],
  setup() {
    const { filter_value, filter_input, filter_wildcard, page_size, page_number } = useQueryParams()
    return { filter_value, filter_input, filter_wildcard, page_size, page_number }
  },
  data() {
    return {
      fields: [
        { key: 'id', label: 'Plate ID', sortable: true },
        { key: 'barcode', label: 'Plate Barcode', sortable: true },
        { key: 'created_at', label: 'Created at (UTC)', sortable: true },
        { key: 'show_details', label: 'Show Details' },
      ],
      filterOptions: [
        { value: '', text: '' },
        { value: 'barcode', text: 'Barcode' },
      ],
      filteredItems: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      totalPages: 1,
      currentPlate: {},
    }
  },
  computed: {
    ...mapGetters(['plates']),
  },
  watch: {
    plates(newValue) {
      this.setInitialData(newValue, { sortBy: 'created_at' })
    },
  },
  methods: {
    alert(message, type) {
      this.showAlert(message, type)
    },
    handleTogleDetails(row) {
      row.toggleDetails()
      this.getPlate(row.item.barcode)
    },
    async getPlate(barcode) {
      this.currentPlate = await this.findPlate({ barcode: barcode })
    },
    async fetchPlates() {
      const page = { size: this.page_size.toString(), number: this.page_number.toString() }
      const filter =
        !this.filter_value || !this.filter_input ? {} : { [this.filter_value]: this.filter_input }

      const { success, errors, meta } = await this.setPlates({ page: page, filter: filter })
      this.totalPages = meta.page_count
      return { success, errors }
    },
    ...mapActions(['setPlates', 'findPlate']),
  },
}
</script>
