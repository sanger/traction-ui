<template>
  <div class="pacbio-plates">
    <b-form-group
      label="Filter"
      label-cols-sm="1"
      label-align-sm="right"
      label-for="filterInput"
      class="mb-0"
    >
      <b-input-group>
        <b-form-input id="filterInput" v-model="filter" type="search" placeholder="Type to Search">
        </b-form-input>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <br />

    <b-table
      id="plate-index"
      show-empty
      responsive
      :items="plates"
      :fields="fields"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      @filtered="onFiltered"
    >
      <template #cell(show_details)="row">
        <b-button
          :id="'details-btn-' + row.item.id"
          size="sm"
          variant="outline-primary"
          @click="row.toggleDetails"
        >
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Plate
        </b-button>
      </template>

      <template #row-details="row">
        <Plate ref="plate" :plate="row.item" @alert="alert"></Plate>
      </template>
    </b-table>

    <span class="font-weight-bold">Total records: {{ plates.length }}</span>

    <div class="clearfix">
      <b-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="plates.length"
        :per-page="perPage"
        aria-controls="plate-index"
      >
      </b-pagination>
      <b-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
        <b-form-input id="input-per-page" v-model="perPage" trim class="w-25"></b-form-input>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import TableHelper from '@/mixins/TableHelper'
import Plate from '@/components/plates/PlateItem'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/plates')

export default {
  name: 'PacbioPlates',
  components: {
    Plate,
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
      filteredItems: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 6,
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters(['plates']),
  },
  created() {
    // When this component is created (the 'created' lifecycle hook is called), we need to get the
    // items for the table
    this.provider()
  },
  methods: {
    alert(message, type) {
      this.showAlert(message, type)
    },
    async provider() {
      try {
        await this.setPlates()
      } catch (error) {
        this.showAlert('Failed to get plates: ' + error.message, 'danger')
      }
    },
    ...mapActions(['setPlates']),
  },
}
</script>
