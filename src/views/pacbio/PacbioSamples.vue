<template>
  <div>
    <alert ref='alert'></alert>

    <p v-if="this.preFilteredMaterials.length > 0" class="font-weight-bold">
      Only showing samples for the following barcodes: {{ this.preFilteredMaterials.map(sample => sample.barcode).join(', ') }}
      <b-button @click="clearPreFilter" size="sm" variant="info">Clear pre-filter</b-button>
    </p>

    <b-form-group label="Filter"
                  label-cols-sm="1"
                  label-align-sm="right"
                  label-for="filterInput"
                  class="mb-0">
      <b-input-group>
        <b-form-input v-model="filter"
                      type="search"
                      id="filterInput"
                      placeholder="Type to Search">
        </b-form-input>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <br>

    <b-table id="samples-table"
             show-empty
             :items="items"
             :fields="fields"
             :filter="filter"
             :per-page="perPage"
             :current-page="currentPage"
             hover
             @filtered="onFiltered"
             selectable
             select-mode="multi"
             @row-selected="onRowSelected">
      <template v-slot:cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span>&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span>&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>

      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card class="text-left">
          <template v-for="field in field_in_details">
            <span :key="field.label" class="font-weight-bold">{{ field.label }}</span>: {{ row.item[field.item] }}
            <br :key="field.label">
          </template>

          <p class="text-center">
            <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
          </p>
        </b-card>
      </template>
    </b-table>

    <span class="font-weight-bold">Total records: {{ rows }}</span>

    <div class="clearfix">
      <printerModal class="float-left"
                    @selectPrinter="handlePrintLabel"
                    :disabled="this.selected.length === 0">
      </printerModal>

      <libraryCreatePacbioModal :selectedSamples="selected"
                                :disabled="this.selected.length === 0"
                                class="float-left">
      </libraryCreatePacbioModal>

      <b-pagination class="float-right"
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="samples-table">
      </b-pagination>
    </div>
  </div>
</template>

<script>
import LibraryCreatePacbioModal from '@/components/LibraryCreatePacbioModal'
import PrinterModal from '@/components/PrinterModal'
import Helper from '@/mixins/Helper'
import MatType from '@/mixins/MatType'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('traction/pacbio/tubes')

export default {
  name: 'Samples',
  mixins: [Helper, MatType, TableHelper],
  components: {
    LibraryCreatePacbioModal,
    PrinterModal,
    Alert
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: ''},
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'sample_name', label: 'Name', sortable: true },
        { key: 'sample_species', label: 'Species', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'show_details', label: '' }
      ],
      field_in_details: [
        { label: 'Library type', item: 'library_type'},
        { label: 'Estimate of GB required', item: 'estimate_of_gb_required'},
        { label: 'Number of SMRT cells', item: 'number_of_smrt_cells'},
        { label: 'Cost code', item: 'cost_code'},
        { label: 'External study ID', item: 'external_study_id'},
      ],
      items: [],
      filteredItems: [],
      selected: [],
      filter: null,
      perPage: 5,
      currentPage: 1,
      preFilteredMaterials: [],
      barcodes: []
    }
  },
  methods: {
    async provider() {
      try {
        this.items = await this.getMaterial(consts.MAT_TYPE_REQUESTS)
      } catch (err) {
        this.log(err)
      }
    },
    clearPreFilter() {
      this.log('clearPreFilter()')
      this.items = Object.keys(this.$store.getters.requests).map(
        key => this.$store.getters.request(key))
      this.preFilteredMaterials = []
    },
  },
  created() {
    this.provider()
  },
  computed: {
    ...mapGetters([ // TODO: these should probably go in the mattype mixin
      'requestsRequest',
      'libraryRequest'
    ])
  }
}
</script>
