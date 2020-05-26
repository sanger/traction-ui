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
             select-mode="single"
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

      <enzymeModal @selectEnzyme="createLibraries"
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
import EnzymeModal from '@/components/saphyr/SaphyrEnzymeModal'
import PrinterModal from '@/components/PrinterModal'
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'
import * as consts from '@/consts/consts'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SaphyrSamples',
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
      filteredItems: [],
      selected: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 6,
      currentPage: 1,
    }
  },
  methods: {
    async createLibraries (selectedEnzymeId) {
      let payload = {'samples': this.selected, 'enzymeID': selectedEnzymeId}
      let response = await this.createLibrariesInTraction(payload)

      if (response.successful || !response.empty ) {
        let barcodes = response.deserialize.libraries.map(l => l.barcode)
        this.showAlert('Libraries successfully created with barcodes: ' + barcodes, 'success')
      } else {
        this.showAlert(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED, 'danger')
      }
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
    ]),
    ...mapActions('traction/saphyr/requests', [
      'setRequests'
    ])
  },
  created() {
    this.provider()
  },
  computed: {
    ...mapGetters('traction/saphyr/requests', [
      'requests'
    ])
  }
}
</script>
