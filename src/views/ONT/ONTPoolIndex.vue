<template>
  <flagged-feature name="dpl_279_ont_libraries_and_pools">
    <DataFetcher :fetcher="fetchOntPools">
      <FilterCard :fetcher="fetchOntPools" :filter-options="filterOptions" />
      <div class="clearfix">
        <traction-pagination
          v-model="currentPage"
          class="float-right"
          :total-rows="pools.length"
          :per-page="perPage"
          aria-controls="pool-index"
        >
        </traction-pagination>

        <traction-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
          <traction-input id="input-per-page" v-model="perPage" trim class="w-25"></traction-input>
        </traction-form-group>
      </div>

      <traction-table
        id="pool-index"
        show-empty
        responsive
        :items="pools"
        :fields="fields"
        :filter="filter"
        :per-page="perPage"
        :current-page="currentPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        hover
        selectable
        select-mode="multi"
        tbody-tr-class="pool"
        @filtered="onFiltered"
        @row-selected="onRowSelected"
      >
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
          <traction-card>
            <traction-table
              small
              bordered
              show-empty
              :items="row.item.libraries"
              :fields="field_in_details"
              :filter="filter"
            >
            </traction-table>
          </traction-card>
        </template>
      </traction-table>
    </DataFetcher>
  </flagged-feature>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import DataFetcher from '../../components/DataFetcher.vue'
import FilterCard from '../../components/FilterCard.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OntPoolIndex',
  components: {
    DataFetcher,
    FilterCard,
  },
  mixins: [TableHelper],
  data() {
    return {
      fields: [
        { key: 'id', label: 'Pool ID', sortable: true, tdClass: 'pool-id' },
        { key: 'barcode', label: 'Pool Barcode', sortable: true, tdClass: 'barcode' },
        { key: 'source_identifier', label: 'Source', sortable: true, tdClass: 'source-identifier' },
        { key: 'volume', label: 'Volume', sortable: true, tdClass: 'volume' },
        { key: 'concentration', label: 'Concentration', sortable: true, tdClass: 'concentration' },
        { key: 'kit_barcode', label: 'Kit Barcode', sortable: true, tdClass: 'kit-barcode' },
        { key: 'insert_size', label: 'Insert Size', sortable: true, tdClass: 'insert-size' },
        {
          key: 'final_library_amount',
          labe: 'Final Library Amount',
          sortable: true,
          tdClass: 'final-library-amount',
        },
        { key: 'created_at', label: 'Created at', sortable: true, tdClass: 'created-at' },
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
        // Need to specify filters in json api resources if we want more filters
      ],
      primary_key: 'id',
      filteredItems: [],
      selected: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 24,
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters('traction/ont', ['pools']),
  },
  methods: {
    ...mapActions('traction/ont', ['fetchOntPools']),
  },
}
</script>
