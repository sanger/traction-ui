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
             @filtered="onFiltered">
      <template slot="selected" slot-scope="row">
        <input type="checkbox" class="selected" v-model="selected" :value="row.item" />
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
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'
import Helper from '@/mixins/Helper'
import MatType from '@/mixins/MatType'
import TableHelper from '@/mixins/TableHelper'
import getTubesForBarcodes from '@/api/TubeRequests'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'

export default {
  name: 'Samples',
  mixins: [Api, Helper, MatType, TableHelper],
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
        await this.createLibrariesInTraction(selectedEnzymeId)
        await this.handleTractionTubes()
      } catch (err) {
        this.showAlert(err)
      }
    },
    async createLibrariesInTraction (selectedEnzymeId) {
      let libraries = this.selected.map(
        item => { return {
          'state': 'pending',
          'saphyr_request_id': item.id,
          'saphyr_enzyme_id': selectedEnzymeId }
        })

      let body = { data: { type: 'libraries', attributes: { libraries: libraries } } }

      let promise = this.tractionSaphyrLibraryRequest.create(body)
      let response = await handlePromise(promise)

      if (response.successful) {
        this.barcodes = response.deserialize.libraries.map(l => l.barcode).join('\n')
      } else {
        throw Error(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + response.errors.message)
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        throw Error(consts.MESSAGE_WARNING_NO_BARCODES)
      }

      let response = await getTubesForBarcodes(this.barcodes, this.tractionSaphyrTubeRequest)
      if (response.successful && !response.empty) {
        let tubes = response.deserialize.tubes
        // Surely all these tubes will be libraries since we are creating libraries?
        if (tubes.every(t => t.material.type === "libraries")) {
          this.$router.push({name: 'Libraries', query: { barcode: tubes.map(tube => tube.barcode) }})
        }
      } else {
        throw Error(consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
      }
    },
    async provider() {
      this.items = await this.getMaterial(consts.MAT_TYPE_REQUESTS)
    },
    clearPreFilter() {
      this.log('clearPreFilter()')
      this.items = Object.keys(this.$store.getters.requests).map(
        key => this.$store.getters.request(key))
      this.preFilteredMaterials = []
    }
  },
  created() {
    this.provider()
  },
  computed: {
    tractionSaphyrLibraryRequest () {
      return this.api.traction.saphyr.libraries
    },
    tractionSaphyrTubeRequest () {
      return this.api.traction.saphyr.tubes
    },
  }
}
</script>
