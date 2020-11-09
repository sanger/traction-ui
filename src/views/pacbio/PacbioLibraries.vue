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

    <b-table id="libraries-table"
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
        <PacbioLibraryEditModal :lib="row.item" @alert="showAlert" >
        </PacbioLibraryEditModal>
      </template>

      <template v-slot:cell(show_details)="row">
        <b-button :id="'details-btn-'+row.item.id" size="sm" @click="row.toggleDetails" class="mr-2" variant="outline-info">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <b-table
              small
              bordered
              show-empty
              :items= row.item.requests
              :fields="field_in_details"
              :filter="filter">
                <template v-slot:cell(edit_tag)="row">
                  <PacbioTagEditModal :request_library="row.item" @alert="showAlert" @reloadPage="provider" >
                  </PacbioTagEditModal>
                </template>
          </b-table>
        </b-card>
      </template>

    </b-table>

    <span class="font-weight-bold">Total records: {{ libraries.length }}</span>

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
                    :disabled="this.selected.length === 0"
                    ref='printerModal'>
      </printerModal>

      <b-pagination class="float-right"
                    v-model="currentPage"
                    :total-rows="libraries.length"
                    :per-page="perPage"
                    aria-controls="libraries-table">
      </b-pagination>
    </div>

    <b-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
        <b-form-input id="input-per-page" v-model="perPage" trim  class="w-25"></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
import Helper from '@/mixins/Helper'
import PacbioLibraryEditModal from '@/components/pacbio/PacbioLibraryEditModal'
import PacbioTagEditModal from '@/components/pacbio/PacbioTagEditModal'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'
import PrinterModal from '@/components/PrinterModal'
import * as consts from '@/consts/consts'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/libraries')

export default {
  name: 'Libraries',
  mixins: [Helper, TableHelper],
  components: {
    Alert,
    PrinterModal,
    PacbioLibraryEditModal,
    PacbioTagEditModal
  },
  data () {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Library ID', sortable: true },
        { key: 'sample_names', label: 'Sample Names', sortable: true },
        { key: 'barcode', label: 'Barcode', sortable: true },
        { key: 'volume', label: 'Volume', sortable: true },
        { key: 'concentration', label: 'Concentration', sortable: true },
        { key: 'template_prep_kit_box_barcode', label: 'Template Prep Kit Box Barcode', sortable: true },
        { key: 'fragment_size', label: 'Fragment Size', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'actions', label: 'Actions' },
        { key: 'show_details', label: '' }
      ],
      field_in_details: [
        { key: 'sample_name', label: "Sample(s)"},
        { key: 'tag_group_id', label: 'Tag(s)'},
        { key: 'edit_tag', label: 'Actions' }
      ],
      filteredItems: [],
      selected: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 6,
      currentPage: 1
    }
  },
  methods: {
    async handleLibraryDelete () {
      try {
        let selectedIds = this.selected.map(s => s.id)
        let responses = await this.deleteLibraries(selectedIds)

        if (responses.every(r => r.successful)) {
          let keyword = selectedIds.length > 1 ? 'Libraries' : 'Library'
          this.showAlert(`${keyword} ${selectedIds.join(', ')} successfully deleted`, 'success')
          this.provider()
        } else {
          throw Error(responses.map(r => r.errors.message).join(','))
        }
      } catch (error) {
        this.showAlert(consts.MESSAGE_ERROR_DELETION_FAILED + error.message, 'danger')
      }
    },
    // Get all the libraries
    // Provider function used by the bootstrap-vue table component
    async provider() {
      try{
         await this.setLibraries()
      } catch (error) {
        this.showAlert("Failed to get libraries: " + error.message, 'danger')
      }
    },
    ...mapActions([
      'deleteLibraries',
      'setLibraries'
    ])
  },
  computed: {
    ...mapGetters([
      'libraries'
    ])
  },
  created() {
    // When this component is created (the 'created' lifecycle hook is called), we need to get the
    // items for the table
    this.provider()
  }
}
</script>
