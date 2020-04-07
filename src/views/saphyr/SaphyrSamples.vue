<template>
  <div>
    <alert ref='alert'></alert>

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
             responsive
             :items="requests"
             :fields="fields"
             :filter="filter"
             :per-page="perPage"
             :current-page="currentPage"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
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

    <span class="font-weight-bold">Total records: {{ requests.length }}</span>

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
                    :total-rows="requests.length"
                    :per-page="perPage"
                    aria-controls="samples-table">
      </b-pagination>
    </div>
    <b-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <b-form-input id="input-per-page" v-model="perPage" trim  class="w-25"></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
import EnzymeModal from '@/components/EnzymeModal'
import PrinterModal from '@/components/PrinterModal'
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Samples',
  mixins: [Helper, TableHelper],
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
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 6,
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
        await this.setRequests()
      } catch (err) {
        this.log(err)
      }
    },
    ...mapActions('traction/saphyr/tubes', [
      'createLibrariesInTraction',
      'getTractionTubesForBarcodes'
    ]),
    ...mapActions('traction/saphyr/requests', [
      'setRequests'
    ])
  },
  created() {
    this.provider()
  },
  computed: {
    ...mapGetters('traction/saphyr/tubes', [
      'tractionTubesWithInfo',
      'tractionTubes',
      'requestsRequest',
      'libraryRequest'
    ]),
    ...mapGetters('traction/saphyr/requests', [
      'requests'
    ])
  }
}
</script>
