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
      id="pool-index"
      show-empty
      responsive
      :items="pools"
      :fields="fields"
      :filter="filter"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      selectable
      select-mode="multi"
      tbody-tr-class="pool"
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
        <router-link
          data-action="edit-pool"
          :to="{ name: 'PacbioPoolCreate', params: { id: row.item.id } }"
        >
          <traction-button :id="'editPool-' + row.item.id" size="sm" theme="edit"
            >Edit</traction-button
          >
        </router-link>
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
        <traction-card>
          <traction-table
            small
            bordered
            show-empty
            :items="row.item.libraries"
            :fields="field_in_details"
            :filter="filter"
          >
          </traction-table>
          <ul v-if="!row.item.run_suitability.valid">
            <li v-for="(error, index) in row.item.run_suitability.formattedErrors" :key="index">
              {{ error }}
            </li>
          </ul>
        </traction-card>
      </template>
    </traction-table>

    <span class="font-weight-bold">Total records: {{ pools.length }}</span>

    <div class="clearfix">
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @selectPrinter="handlePrintLabel('pacbio', $event)"
      >
      </printerModal>
      <traction-pagination
        v-model="currentPage"
        class="float-right"
        :total-rows="pools.length"
        :per-page="perPage"
        aria-controls="pool-index"
      >
      </traction-pagination>
    </div>

    <traction-form-group label-cols-lg="1" label="Per Page" label-for="input-per-page">
      <traction-input id="input-per-page" v-model="perPage" trim class="w-25"></traction-input>
    </traction-form-group>
  </div>
</template>

<script>
import PrintHelper from '@/mixins/PrintHelper'
import TableHelper from '@/mixins/TableHelper'
import PrinterModal from '@/components/PrinterModal'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PacbioPoolIndex',
  components: {
    PrinterModal,
  },
  mixins: [PrintHelper, TableHelper],
  data() {
    return {
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Pool ID', sortable: true, tdClass: 'pool-id' },
        {
          key: 'run_suitability',
          label: 'Ready',
          formatter: ({ ready_for_run }) => (ready_for_run ? '✓' : ''),
          sortable: true,
        },
        { key: 'barcode', label: 'Pool Barcode', sortable: true, tdClass: 'barcode' },
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
        { key: 'created_at', label: 'Created at', sortable: true, tdClass: 'created-at' },
        { key: 'actions', label: 'Actions' },
        { key: 'show_details', label: '' },
      ],
      field_in_details: [
        { key: 'sample_name', label: 'Sample(s)' },
        { key: 'group_id', label: 'Tag(s)' },
      ],
      primary_key: 'id',
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
    ...mapGetters('traction/pacbio/pools', ['pools']),
  },
  created() {
    // When this component is created (the 'created' lifecycle hook is called), we need to get the
    // items for the table
    this.provider()
  },
  methods: {
    // Get all the libraries
    // Provider function used by the bootstrap-vue table component
    async provider() {
      try {
        const { success, errors } = await this.setPools()
        if (!success) {
          throw errors
        }
      } catch (error) {
        this.showAlert('Failed to get pools: ' + error.message, 'danger')
      }
    },

    ...mapActions('traction/pacbio/pools', ['setPools']),
    ...mapActions('printMyBarcode', ['printJob']),
  },
}
</script>
