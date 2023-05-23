<template>
  <DataFetcher :fetcher="setPlates">
    <FilterCard :fetcher="setPlates" :filter-options="filterOptions" />

    <div class="clearfix">
      <traction-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="plates.length"
        :per-page="perPage"
        aria-controls="plate-index"
        @input="onPageChange($event)"
      >
      </traction-pagination>
    </div>

    <traction-table
      id="plate-index"
      primary_key="id"
      :fields="fields"
      :items="tableData"
      show-empty
      responsive
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      @filtered="onFiltered"
    >
      <template #cell(show_details)="row">
        <traction-button
          :id="'details-btn-' + row.id"
          size="sm"
          theme="default"
          @click="
            row.toggleDetails()
            getPlate(row.item.barcode)
          "
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
  </DataFetcher>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import Plate from '@/components/plates/PlateItem'
import FilterCard from '@/components/FilterCard'
import DataFetcher from '@/components/DataFetcher'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/plates')
export default {
  name: 'PacbioPlates',
  components: {
    Plate,
    FilterCard,
    DataFetcher,
  },
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'id', label: 'Plate ID', sortable: true },
        { key: 'barcode', label: 'Plate Barcode', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
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
      perPage: 25,
      currentPage: 1,
      currentPlate: {},
    }
  },
  computed: {
    ...mapGetters(['plates']),
  },
  watch: {
    plates(newValue) {
      this.setInitialData(newValue, this.perPage, { sortBy: 'created_at' })
    },
  },
  methods: {
    alert(message, type) {
      this.showAlert(message, type)
    },
    async getPlate(barcode) {
      this.currentPlate = await this.findPlate({ barcode: barcode })
    },
    ...mapActions(['setPlates', 'findPlate']),
  },
}
</script>
