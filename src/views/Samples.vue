<template>
  <div>
    <alert ref='alert'></alert>

    <p v-if="this.preFilteredSamples.length > 0" class="font-weight-bold">
      Only showing samples for the following barcodes: {{ this.preFilteredSamples.map(sample => sample.barcode).join(', ') }}
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
import getTubesForBarcodes from '@/api/TubeRequests'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'

export default {
  name: 'Samples',
  mixins: [Api, Helper],
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
      preFilteredSamples: [],
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
        throw consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + response.errors.message
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        throw consts.MESSAGE_ERROR_NO_BARCODES
      }

      let response = await getTubesForBarcodes(this.barcodes, this.tractionSaphyrTubeRequest)
      if (response.successful && !response.empty) {
        let tubes = response.deserialize.tubes
        console.log(tubes)
        // Surely all these tubes will be libraries since we are creating libraries?
        if (tubes.every(t => t.material.type == "libraries")) {
          this.$router.push({name: 'Libraries', query: { barcode: tubes.map(tube => tube.barcode) }})
        }
      } else {
        throw 'Failed to get Traction tubes'
      }
    },
    async provider() {
      this.items = await this.getSamples()
    },
    // Get all the samples (requests)
    async getSamples() {
      this.log('getSamples()')
      let promise = this.tractionSaphyrRequestRequest.get()
      let response = await handlePromise(promise)

      if (response.successful) {
        let samples = response.deserialize.requests
        this.$store.commit('addSamples', samples)

        // Pre-filter the samples to those provided as a query paramater
        if (typeof this.$route.query.barcode !== 'undefined'
              && this.$route.query.barcode !== '') {

          let preFilteredBarcodes = []
          if (typeof this.$route.query.barcode === 'string') {
            preFilteredBarcodes.push(this.$route.query.barcode)
          } else {
            preFilteredBarcodes.push(...this.$route.query.barcode)
          }
          this.log(`preFilteredBarcodes: ${preFilteredBarcodes}`)

          // There might be barcodes in the query which are invalid, remove these and alert the user
          let barcodesOfSamples = samples.map(sample => sample.barcode)
          let invalidBarcodes = preFilteredBarcodes.filter(
            barcode => !barcodesOfSamples.includes(barcode))

          if (invalidBarcodes.length > 0) {
            this.showAlert(consts.MESSAGE_ERROR_INVALID_BARCODES.concat(invalidBarcodes.join(', ')),
              'danger')
          }

          this.preFilteredSamples = samples.filter(
            sample => preFilteredBarcodes.includes(sample.barcode))

          return this.preFilteredSamples
        }
        return samples
      } else {
        this.showAlert(response.errors.message)
        return []
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.filteredItems = filteredItems
      this.currentPage = 1
    },
    clearPreFilter() {
      this.log('clearPreFilter()')
      this.items = Object.keys(this.$store.getters.samples).map(
        key => this.$store.getters.sample(key))
      this.preFilteredSamples = []
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
    tractionSaphyrRequestRequest () {
      return this.api.traction.saphyr.requests
    },
    /**
     * We need the pagination component to reflect the correct number of rows dependent on the
     * items after filtering has been applied
     */
    rows() {
      if (this.filteredItems.length > 0) {
        return this.filteredItems.length
      }

      if (this.filteredItems.length == 0 && this.filter !== '' && this.filter !== null) {
        return this.filteredItems.length
      }

      return this.items.length
    }
  }
}
</script>
