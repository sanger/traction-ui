<template>
  <div>
    <alert ref='alert'></alert>

    <p v-if="this.preFilteredLibraries.length > 0" class="font-weight-bold">
      Only showing libraries for the following barcodes: {{ this.preFilteredLibraries.map(library => library.barcode).join(', ') }}
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

    <b-table id="libraries-table"
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
      <b-button variant="danger"
                class="float-left"
                id="deleteLibraries"
                @click="handleLibraryDelete"
                :disabled="this.selected.length === 0">
        Delete Libraries
      </b-button>
      <printerModal class="float-left"
                    @selectPrinter="handlePrintLabel"
                    :disabled="this.selected.length === 0">
      </printerModal>

      <b-pagination class="float-right"
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="libraries-table">
      </b-pagination>
    </div>
  </div>
</template>

<script>
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'
import Helper from '@/mixins/Helper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import * as consts from '@/consts/consts'

export default {
  name: 'Libraries',
  mixins: [Api, Helper],
  data () {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Library ID', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'sample_name', label: 'Sample Name', sortable: true },
        { key: 'enzyme_name', label: 'Enzyme Name', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'deactivated_at', label: 'Deactivated at', sortable: true },
      ],
      items: [],
      filteredItems: [],
      selected: [],
      filter: null,
      perPage: 5,
      currentPage: 1,
      preFilteredLibraries: []
    }
  },
  components: {
    Alert,
    PrinterModal
  },
  methods: {
    async handleLibraryDelete () {
      try {
        await this.deleteLibraries()
      } catch (err) {
        this.showAlert(consts.MESSAGE_ERROR_DELETION_FAILED + err, 'danger')
      }
    },
    async deleteLibraries () {
      let selectedIds = this.selected.map(s => s.id)
      let promises = this.tractionSaphyrLibraryRequest.destroy(selectedIds)
      let responses = await Promise.all(promises.map(promise => handlePromise(promise)))

      if (responses.every(r => r.successful)) {
        let keyword = selectedIds.length > 1 ? 'Libraries' : 'Library'
        this.showAlert(`${keyword} ${selectedIds.join(', ')} successfully deleted`)
      } else {
        throw responses.map(r => r.errors.message).join(',')
      }
    },
    // Get all the libraries
    // Provider function used my the bootstrap-vue table component
    async provider() {
      this.items = await this.getLibraries()
    },
    async getLibraries() {
      this.log('getLibraries()')
      let promise = this.tractionSaphyrLibraryRequest.get()
      let response = await handlePromise(promise)

      if (response.successful) {
        let libraries = response.deserialize.libraries
        this.$store.commit('addLibraries', libraries)

        // Pre-filter the libraries to those provided as a query paramater
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
          let barcodesOfLibraries = libraries.map(library => library.barcode)
          let invalidBarcodes = preFilteredBarcodes.filter(
            barcode => !barcodesOfLibraries.includes(barcode))

          if (invalidBarcodes.length > 0) {
            this.showAlert(consts.MESSAGE_ERROR_INVALID_BARCODES.concat(invalidBarcodes.join(', ')),
              'danger')
          }

          this.preFilteredLibraries = libraries.filter(
            library => preFilteredBarcodes.includes(library.barcode))

          return this.preFilteredLibraries
        }
        return libraries
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
      this.items = Object.keys(this.$store.getters.libraries).map(
        key => this.$store.getters.library(key))
      this.preFilteredLibraries = []
    }
  },
  created() {
    // When this component is created (the 'created' lifecycle hook is called), we need to get the
    // items for the table
    this.provider()
  },
  computed: {
    tractionSaphyrLibraryRequest () {
      return this.api.traction.saphyr.libraries
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
