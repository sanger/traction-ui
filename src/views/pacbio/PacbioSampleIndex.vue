<template>
  <div>
    <alert ref="alert"></alert>

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
      id="samples-table"
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
      selectable
      select-mode="single"
      @filtered="onFiltered"
      @row-selected="onRowSelected"
    >
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
        <PacbioSampleMetadataEdit ref="sampleMetadata" :req="row.item" @alert="showAlert">
        </PacbioSampleMetadataEdit>
      </template>

      <template v-slot:cell(show_details)="row">
        <b-button
          :id="'details-btn-' + row.item.id"
          size="sm"
          class="mr-2"
          variant="outline-info"
          @click="row.toggleDetails"
        >
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card class="text-left">
          <template v-for="(field, index) in field_in_details">
            <span :key="field.label + index" class="font-weight-bold">{{ field.label }}</span
            >: {{ row.item[field.item] }}
            <br :key="field.label" />
          </template>
        </b-card>
      </template>
    </b-table>

    <span class="font-weight-bold">Total records: {{ requests.length }}</span>

    <div class="clearfix">
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @selectPrinter="handlePrintLabel"
      >
      </printerModal>

      <PacbioLibraryCreate
        :selected-samples="selected"
        :disabled="selected.length === 0"
        class="float-left"
        @alert="showAlert"
      >
      </PacbioLibraryCreate>

      <b-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="requests.length"
        :per-page="perPage"
        aria-controls="samples-table"
      >
      </b-pagination>
    </div>
    <b-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <b-form-input id="input-per-page" v-model="perPage" trim class="w-25"></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate'
import PacbioSampleMetadataEdit from '@/components/pacbio/PacbioSampleMetadataEdit'
import PrinterModal from '@/components/PrinterModal'
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/requests')

export default {
  name: 'Samples',
  components: {
    PacbioLibraryCreate,
    PrinterModal,
    Alert,
    PacbioSampleMetadataEdit,
  },
  mixins: [Helper, TableHelper],
  data() {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Sample ID (Request)', sortable: true },
        { key: 'sample_name', label: 'Name', sortable: true },
        { key: 'sample_species', label: 'Species', sortable: true },
        { key: 'source_identifier', label: 'Source', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'actions', label: 'Actions' },
        { key: 'show_details', label: '' },
      ],
      field_in_details: [
        { label: 'Library type', item: 'library_type' },
        { label: 'Estimate of GB required', item: 'estimate_of_gb_required' },
        { label: 'Number of SMRT cells', item: 'number_of_smrt_cells' },
        { label: 'Cost code', item: 'cost_code' },
        { label: 'External study ID', item: 'external_study_id' },
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
  computed: {
    ...mapGetters(['requests']),
  },
  created() {
    this.provider()
  },
  methods: {
    async provider() {
      try {
        await this.setRequests()
      } catch (error) {
        this.showAlert('Failed to get samples: ' + error.message, 'danger')
      }
    },
    ...mapActions(['setRequests']),
  },
}
</script>
