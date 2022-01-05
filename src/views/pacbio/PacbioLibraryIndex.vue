<template>
  <div>
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
      id="library-index"
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
        aria-controls="library-index"
      >
      </b-pagination>
    </div>

    <b-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <b-form-input id="input-per-page" v-model="perPage" trim class="w-25"></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
import PrintHelper from '@/mixins/PrintHelper'
import PacbioLibraryEdit from '@/components/pacbio/PacbioLibraryEdit'
import TableHelper from '@/mixins/TableHelper'
import PrinterModal from '@/components/PrinterModal'
import * as consts from '@/consts/consts'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/libraries')

export default {
  name: 'Libraries',
  components: {
    PrinterModal,
    PacbioLibraryEdit,
  },
  mixins: [PrintHelper, TableHelper],
  data() {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'pool.id', label: 'pool ID', sortable: true, tdClass: 'pool-id' },
        { key: 'id', label: 'Library ID', sortable: true, tdClass: 'library-id' },
        { key: 'sample_name', label: 'Sample Name', sortable: true, tdClass: 'sample-name' },
        { key: 'barcode', label: 'Barcode', sortable: true, tdClass: 'barcode' },
        { key: 'source_identifier', label: 'Source', sortable: true, tdClass: 'source-identifier' },
        { key: 'volume', label: 'Volume', sortable: true, tdClass: 'volume' },
        { key: 'concentration', label: 'Concentration', sortable: true, tdClass: 'concentration' },
        {
          key: 'template_prep_kit_box_barcode',
          label: 'Template Prep Kit Box Barcode',
          sortable: true,
          tdClass: 'template-prep-kit-box-barcode',
        },
        { key: 'insert_size', label: 'Insert Size', sortable: true, tdClass: 'insert-size' },
        { key: 'tag_group_id', label: 'Tag', sortable: true, tdClass: 'tag-group-id' },
        { key: 'created_at', label: 'Created at', sortable: true, tdClass: 'created-at' },
        { key: 'actions', label: 'Actions' },
      ],
      primary_key: 'id',
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
