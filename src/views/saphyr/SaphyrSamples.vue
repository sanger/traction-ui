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
    </b-table>

    <span class="font-weight-bold">Total records: {{ rows }}</span>

    <div class="clearfix">
      <printerModal class="float-left"
                    @selectPrinter="handlePrintLabel"
                    :disabled="this.selected.length === 0">
      </printerModal>

      <enzymeModal @selectEnzyme="handleLibraryCreate"
                   :disabled="this.selected.length === 0"
                   class="float-left">
      </enzymeModal>

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
import EnzymeModal from '@/components/EnzymeModal'
import PrinterModal from '@/components/PrinterModal'
import Helper from '@/mixins/Helper'
import MatType from '@/mixins/MatType'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'
import { createNamespacedHelpers } from 'vuex'

const { mapActions, mapGetters } = createNamespacedHelpers('traction/saphyr/tubes')

export default {
  name: 'Samples',
  mixins: [Helper, MatType, TableHelper],
  components: {
    EnzymeModal,
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
        { key: 'created_at', label: 'Created at', sortable: true }
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
    async handleLibraryCreate (selectedEnzymeId) {
      try {
        await this.createLibraries(selectedEnzymeId)
        await this.handleTractionTubes()
      } catch (err) {
        this.showAlert(err)
      }
    },
    async createLibraries (selectedEnzymeId) {
      let payload = {'samples': this.selected, 'enzymeID': selectedEnzymeId}
      let response = await this.createLibrariesInTraction(payload)

      if (response.successful || !response.empty ) {
        this.barcodes = response.deserialize.libraries.map(l => l.barcode)
      } else {
        throw Error(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + response.errors.message)
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        throw Error(consts.MESSAGE_WARNING_NO_BARCODES)
      }

      let response = await this.getTractionTubesForBarcodes(this.barcodes)
      if (response.successful && !response.empty) {
        let tubes = this.tractionTubes
        // Surely all these tubes will be libraries since we are creating libraries?
        if (tubes.every(t => t.material.type === "libraries")) {
          this.redirectToLibraries(tubes)
        }
      } else {
        throw Error(consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
      }
    },
    redirectToLibraries (tubes) {
      this.$router.push({name: 'SaphyrLibraries', query: { barcode: tubes.map(tube => tube.barcode) }})
    },
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
    ...mapActions([
      'createLibrariesInTraction',
      'getTractionTubesForBarcodes'
    ]),
  },
  created() {
    this.provider()
  },
  computed: {
    ...mapGetters([
      'tractionTubesWithInfo',
      'tractionTubes',
      'requestsRequest',
      'libraryRequest'
    ])
  }
}
</script>
