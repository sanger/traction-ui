<template>
  <div>
    <traction-form-group
      label="Filter"
      label-cols-sm="1"
      label-align-sm="right"
      label-for="filterInput"
      class="mb-0"
    >
      <traction-input-group>
        <traction-input
          id="filterInput"
          v-model="filter"
          type="search"
          placeholder="Type to Search"
        >
        </traction-input>
        <traction-input-group-append>
          <traction-button :disabled="!filter" @click="filter = ''">Clear</traction-button>
        </traction-input-group-append>
      </traction-input-group>
    </traction-form-group>
    <br />

    <traction-table
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
      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span>&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span>&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>

      <template #cell(actions)="row">
        <PacbioSampleMetadataEdit ref="sampleMetadata" :req="row.item" @alert="showAlert">
        </PacbioSampleMetadataEdit>
      </template>

      <template #cell(show_details)="row">
        <traction-button
          :id="'details-btn-' + row.item.id"
          size="sm"
          class="mr-2"
          theme="default"
          @click="row.toggleDetails"
        >
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </traction-button>
      </template>

      <template #row-details="row">
        <traction-card class="text-left">
          <span
            v-for="(field, index) in field_in_details"
            :key="field.label + index"
            class="font-weight-bold"
            >{{ field.label }}</span
          >: {{ row.item[field.item] }}
          <br />
        </traction-card>
      </template>
    </traction-table>

    <span class="font-weight-bold">Total records: {{ requests.length }}</span>

    <div class="clearfix">
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @selectPrinter="handlePrintLabel('pacbio', $event)"
      >
      </printerModal>

      <PacbioLibraryCreate
        ref="libraryCreateBtn"
        :selected-sample="selected[0]"
        :disabled="selected.length === 0"
        class="float-left"
        @alert="showAlert"
      >
      </PacbioLibraryCreate>

      <traction-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="requests.length"
        :per-page="perPage"
        aria-controls="samples-table"
      >
      </traction-pagination>
    </div>
    <traction-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <traction-input id="input-per-page" v-model="perPage" trim class="w-25"></traction-input>
    </traction-form-group>
  </div>
</template>

<script>
import PacbioLibraryCreate from '@/components/pacbio/PacbioLibraryCreate'
import PacbioSampleMetadataEdit from '@/components/pacbio/PacbioSampleMetadataEdit'
import PrinterModal from '@/components/PrinterModal'
import PrintHelper from '@/mixins/PrintHelper'
import TableHelper from '@/mixins/TableHelper'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PacbioSampleIndex',
  components: {
    PacbioLibraryCreate,
    PrinterModal,
    PacbioSampleMetadataEdit,
  },
  mixins: [PrintHelper, TableHelper],
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
      perPage: 24,
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/requests', ['requests']),
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

    ...mapActions('traction/pacbio/requests', ['setRequests']),
    ...mapActions('printMyBarcode', ['printJob']),
  },
}
</script>
