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

    <b-table id="runs-table"
          hover
          show-empty
          :items="runs"
          :fields="fields"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :per-page="perPage"
          :current-page="currentPage"
          @filtered="onFiltered">

        <template v-slot:cell(actions)="row">
          <b-button :id="generateId('generate-sample-sheet', row.item.id)"
                    variant="outline-dark"
                    size="sm"
                    class="mr-1"
                    @click="generateSampleSheet(row.item.id)">
            Generate Sample Sheet
          </b-button>
        </template>

    </b-table>

  </div>
</template>

<script>
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/runs')

export default {
  name: 'PacbioRuns',
  mixins: [Helper, TableHelper],
  props: {
  },
  data () {
    return {
      fields: [
        { key: 'id', label: 'Run ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        { key: 'template_prep_kit_box_barcode', label: 'Template Prep Kit BB', sortable: true },
        { key: 'binding_kit_box_barcode', label: 'Binding Kit BB', sortable: true },
        { key: 'template_prep_kit_box_barcode', label: 'Template Prep Kit BB', sortable: true },
        { key: 'sequencing_kit_box_barcode', label: 'Sequencing Kit BB', sortable: true },
        { key: 'dna_control_complex_box_barcode', label: 'DNA Control Complex BB', sortable: true },
        { key: 'system_name', label: 'System Name', sortable: true },
        { key: 'created_at', label: 'Created at', sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      filteredItems: [],
      filter: null,
      sortBy: 'created_at',
      sortDesc: true,
      perPage: 5,
      currentPage: 1,
    }
  },
  methods: {
    async provider() {
      try {
        await this.setRuns()
      } catch (error) {
        this.showAlert("Failed to get runs: " + error.message, 'danger')
      }
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    ...mapActions([
      'setRuns',
      'generateSampleSheet'
    ])
  },
  components: {
    Alert
  },
  computed: {
    ...mapGetters([
      'runs'
    ])
  },
  created() {
    this.provider()
  },
}
</script>

<style>
</style>