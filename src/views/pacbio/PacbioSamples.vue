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

      <template v-slot:cell(actions)="row">
        <PacbioSampleMetadataModal :req="row.item" @alert="showAlert" >
        </PacbioSampleMetadataModal>
      </template>

      <template v-slot:cell(show_details)="row">
        <b-button :id="'details-btn-'+row.item.id" size="sm" @click="row.toggleDetails" class="mr-2" variant="outline-info">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card class="text-left">
          <template v-for="(field, index) in field_in_details">
            <span :key="field.label+index" class="font-weight-bold">{{ field.label }}</span>: {{ row.item[field.item] }}
            <br :key="field.label">
          </template>

          <p class="text-center">
            <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
          </p>
        </b-card>
      </template>
    </b-table>

    <span class="font-weight-bold">Total records: {{ requests.length }}</span>

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
import LibraryCreatePacbioModal from '@/components/LibraryCreatePacbioModal'
import PacbioSampleMetadataModal from '@/components/PacbioSampleMetadataModal'
import PrinterModal from '@/components/PrinterModal'
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/requests')

export default {
  name: 'Samples',
  mixins: [Helper, TableHelper],
  components: {
    LibraryCreatePacbioModal,
    PrinterModal,
    Alert,
    PacbioSampleMetadataModal
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: ''},
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'sample_name', label: 'Name', sortable: true },
        { key: 'sample_species', label: 'Species', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'source_barcode', label: 'Source barcode', sortable: true},
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'actions', label: 'Actions' },
        { key: 'show_details', label: '' }
      ],
      field_in_details: [
        { label: 'Library type', item: 'library_type'},
        { label: 'Estimate of GB required', item: 'estimate_of_gb_required'},
        { label: 'Number of SMRT cells', item: 'number_of_smrt_cells'},
        { label: 'Cost code', item: 'cost_code'},
        { label: 'External study ID', item: 'external_study_id'}
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
    async provider() {
      try {
        await this.setRequests()
      } catch (error) {
        this.showAlert("Failed to get samples: " + error.message, 'danger')
      }
    },
    ...mapActions([
      'setRequests'
    ]),
  },
  computed: {
    ...mapGetters([
      'requests'
    ])
  },
  created() {
    this.provider()
  },
}
</script>
