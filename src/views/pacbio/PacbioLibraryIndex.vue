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
      id="libraries"
      show-empty
      responsive
      :items="libraries"
      :fields="fields"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      selectable
      select-mode="multi"
      tbody-tr-class="library"
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
        <PacbioLibraryEdit :lib="row.item" @alert="showAlert"> </PacbioLibraryEdit>
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
        <b-card>
          <b-table
            small
            bordered
            show-empty
            :items="row.item.requests"
            :fields="field_in_details"
            :filter="filter"
          >
            <template v-slot:cell(edit_tag)="row">
              <PacbioLibraryTagEdit
                :request_library="row.item"
                @alert="showAlert"
                @reloadPage="provider"
              >
              </PacbioLibraryTagEdit>
            </template>
          </b-table>
        </b-card>
      </template>
    </b-table>

    <span class="font-weight-bold">Total records: {{ libraries.length }}</span>

    <div class="clearfix">
      <b-button
        id="deleteLibraries"
        variant="danger"
        class="float-left"
        :disabled="selected.length === 0"
        @click="handleLibraryDelete"
      >
        Delete Libraries
      </b-button>
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @selectPrinter="handlePrintLabel"
      >
      </printerModal>

      <b-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="libraries.length"
        :per-page="perPage"
        aria-controls="libraries-table"
      >
      </b-pagination>
    </div>

    <b-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <b-form-input id="input-per-page" v-model="perPage" trim class="w-25"></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import PacbioLibraryEdit from '@/components/pacbio/PacbioLibraryEdit'
import PacbioLibraryTagEdit from '@/components/pacbio/PacbioLibraryTagEdit'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import * as consts from '@/consts/consts'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/libraries')

export default {
  name: 'Libraries',
  components: {
    Alert,
    PrinterModal,
    PacbioLibraryEdit,
    PacbioLibraryTagEdit,
  },
  mixins: [Helper, TableHelper],
  data() {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Library ID', sortable: true, class: 'library-id' },
        { key: 'sample_name', label: 'Sample Name', sortable: true, class: 'sample-name' },
        { key: 'barcode', label: 'Barcode', sortable: true, class: 'barcode' },
        { key: 'source_identifier', label: 'Source', sortable: true, class: 'source_identifier' },
        { key: 'volume', label: 'Volume', sortable: true, class: 'volume' },
        { key: 'concentration', label: 'Concentration', sortable: true, class: 'concentration' },
        {
          key: 'template_prep_kit_box_barcode',
          label: 'Template Prep Kit Box Barcode',
          sortable: true,
          class: 'template-prep-kit-box-barcode',
        },
        { key: 'fragment_size', label: 'Fragment Size', sortable: true, class: 'fragment-size' },
        { key: 'created_at', label: 'Created at', sortable: true, class: 'created-at' },
        { key: 'actions', label: 'Actions' },
        { key: 'show_details', label: '' },
      ],
      field_in_details: [
        { key: 'sample_name', label: 'Sample(s)' },
        { key: 'tag_group_id', label: 'Tag(s)' },
        { key: 'edit_tag', label: 'Actions' },
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
    ...mapGetters(['libraries']),
  },
  created() {
    // When this component is created (the 'created' lifecycle hook is called), we need to get the
    // items for the table
    this.provider()
  },
  methods: {
    async handleLibraryDelete() {
      try {
        let selectedIds = this.selected.map((s) => s.id)
        let responses = await this.deleteLibraries(selectedIds)

        if (responses.every((r) => r.successful)) {
          let keyword = selectedIds.length > 1 ? 'Libraries' : 'Library'
          this.showAlert(`${keyword} ${selectedIds.join(', ')} successfully deleted`, 'success')
          this.provider()
        } else {
          throw Error(responses.map((r) => r.errors.message).join(','))
        }
      } catch (error) {
        this.showAlert(consts.MESSAGE_ERROR_DELETION_FAILED + error.message, 'danger')
      }
    },
    // Get all the libraries
    // Provider function used by the bootstrap-vue table component
    async provider() {
      try {
        await this.setLibraries()
      } catch (error) {
        this.showAlert('Failed to get libraries: ' + error.message, 'danger')
      }
    },
    ...mapActions(['deleteLibraries', 'setLibraries']),
  },
}
</script>
