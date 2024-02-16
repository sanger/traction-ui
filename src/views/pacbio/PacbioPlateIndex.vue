<template>
  <DataFetcher :fetcher="fetchPlates">
    <FilterCard :fetcher="fetchPlates" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination class="float-right" aria-controls="plate-index"> </traction-pagination>
      </div>

      <traction-table
        id="plate-index"
        v-model:sort-by="sortBy"
        primary_key="id"
        :fields="fields"
        :items="plates"
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
import Plate from '@/components/plates/PlateItem'
import FilterCard from '@/components/FilterCard'
import DataFetcher from '@/components/DataFetcher'
import { createNamespacedHelpers } from 'vuex'
import useQueryParams from '@/composables/useQueryParams'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/plates')

export default {
  name: 'PacbioPlates',
  components: {
    Plate,
    FilterCard,
    DataFetcher,
  },
  setup() {
    const { fetchWithQueryParams } = useQueryParams()
    return { fetchWithQueryParams }
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
      sortBy: 'created_at',
      currentPlate: {},
    }
  },
  computed: {
    ...mapGetters(['plates']),
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
      return await this.fetchWithQueryParams(this.setPlates, this.filterOptions)
    },
    ...mapActions(['setPlates', 'findPlate']),
  },
}
</script>
