<template>
  <DataFetcher :fetcher="fetchPools">
    <FilterCard :fetcher="fetchPools" :filter-options="filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-pagination class="float-right" aria-controls="pool-index"> </traction-pagination>
      </div>

      <traction-table
        id="pool-index"
        v-model:sort-by="sortBy"
        :items="updatedPools"
        :fields="fields"
        selectable
        select-mode="multi"
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

        <template #cell(actions)="row">
          <router-link
            data-action="edit-pool"
            :to="{ name: 'ONTPoolCreate', params: { id: row.item.id } }"
          >
            <traction-button :id="'editPool-' + row.item.id" size="sm" theme="edit"
              >Edit</traction-button
            >
          </router-link>
        </template>

        <template #cell(show_details)="row">
          <traction-button
            :id="'details-btn-' + row.item.id"
            size="sm"
            class="mr-2"
            theme="default"
            @click="row.toggleDetails"
          >
            {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
          </traction-button>
        </template>

        <template #row-details="row">
          <div>
            <traction-table :items="row.item.libraries" :fields="field_in_details">
            </traction-table>
          </div>
        </template>
      </traction-table>

      <div class="clearfix">
        <printerModal
          ref="printerModal"
          class="float-left"
          :disabled="selected.length === 0"
          @select-printer="printLabels($event)"
        >
        </printerModal>
      </div>
      <LocationFetcher :barcodes="barcodes" @locationData="updateLocations" />
    </div>
  </DataFetcher>
</template>

<script>
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import PrinterModal from '@/components/labelPrinting/PrinterModal.vue'
import { mapActions, mapGetters } from 'vuex'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import useQueryParams from '@/composables/useQueryParams.js'
import { usePrintingStore } from '@/stores/printing.js'
import LocationFetcher from '@/components/LocationFetcher.vue'

export default {
  name: 'OntPoolIndex',
  components: {
    DataFetcher,
    FilterCard,
    PrinterModal,
    LocationFetcher,
  },
  setup() {
    const { fetchWithQueryParams } = useQueryParams()
    return { fetchWithQueryParams }
  },
  data() {
    return {
      fields: [
        { key: 'selected', label: '\u2713' },
        { key: 'id', label: 'Pool ID', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'source_identifier', label: 'Source', sortable: true },
        { key: 'volume', label: 'Volume', sortable: true },
        { key: 'concentration', label: 'Concentration', sortable: true },
        { key: 'kit_barcode', label: 'Kit Barcode', sortable: true },
        { key: 'insert_size', label: 'Insert Size', sortable: true },
        {
          key: 'final_library_amount',
          label: 'Final Library Amount',
          sortable: true,
        },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'created_at', label: 'Created at (UTC)', sortable: true },
        { key: 'actions', label: 'Actions' },
        { key: 'show_details', label: '' },
      ],
      field_in_details: [
        { key: 'sample_name', label: 'Sample(s)' },
        { key: 'group_id', label: 'Tag(s)' },
      ],
      filterOptions: [
        { value: '', text: '' },
        { value: 'id', text: 'Pool ID' },
        { value: 'barcode', text: 'Barcode' },
        { value: 'sample_name', text: 'Sample Name' },
        // Need to specify filters in json api resources if we want more filters
      ],
      selected: [],
      sortBy: 'created_at',
      sortDesc: true,
      updatedPools: [], // New data property for the updated pools list
    }
  },
  computed: {
    ...mapGetters('traction/ont/pools', ['pools']),
    printingStore() {
      return usePrintingStore()
    },
    barcodes() {
      console.log(this.pools.map((request) => request.barcode).filter(Boolean));
      return this.pools.map((request) => request.barcode).filter(Boolean);
    }
  },
  watch: {
    pools: {
      immediate: true,
      handler() {
        this.updatedPools = this.pools
      },
    },
  },
  methods: {
    /* 
      create the labels needed for the print job
      each label will be in the format { first_line: pipeline - type, second_line: current date, 
      third_line: barcode, fourth_line: source, label_name: }
      @returns {Array[{Object}, {Object} ...]}
    */
    createLabels() {
      const date = getCurrentDate()
      return this.selected.map(({ barcode, source_identifier }) => {
        return {
          barcode,
          first_line: 'Ont - Pool',
          second_line: date,
          third_line: barcode,
          fourth_line: source_identifier,
          label_name: 'main_label',
        }
      })
    },
    /*
      creates the print job and shows a success or failure alert
      @param {String} printerName The name of the printer to send the print job to
    */
    async printLabels(printerName) {
      const { success, message = {} } = await this.printingStore.createPrintJob({
        printerName,
        labels: this.createLabels(),
        copies: 1,
      })

      this.showAlert(message, success ? 'success' : 'danger')
    },
    async fetchPools() {
      return await this.fetchWithQueryParams(this.fetchOntPools, this.filterOptions)
    },
    async updateLocations(locationsData) {
      this.updatedPools = this.updatedPools.map((pool) => {
        const location = locationsData.find((loc) => loc.barcode === pool.barcode)
        return {
          ...pool,
          location: location
            ? location.coordinates && Object.keys(location.coordinates).length
              ? `${location.name} - ${location.coordinates.row}, ${location.coordinates.column}`
              : location.name
            : '-',
        }
      })
    },
    ...mapActions('traction/ont/pools', ['fetchOntPools']),
  },
}
</script>
