<template>
  <div class="ont-libraries">
    <alert ref='alert'></alert>
    <b-table 
      id="libraries-table"
      hover 
      bordered
      responsive
      :items="libraries"
      :fields="fields"
      selectable
      select-mode="single"
      @row-selected="onRowSelected"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      sticky-header
      show-empty>
    </b-table>
    
    <div class="clearfix">
      <printerModal class="float-left"
                    @selectPrinter="handlePrintLabel"
                    :disabled="this.selected.length === 0">
      </printerModal>

      <b-button variant="danger"
        class="float-left"
        id="deleteLibrary-btn"
        @click="handleLibraryDelete"
        :disabled="this.selected.length === 0">
        Delete Library
      </b-button>
    </div>
  </div>
</template>

<script>
import LIBRARIES_ALL_QUERY from '@/graphql/queries/LibrariesAll.query.gql'
import DELETE_ONT_LIBRARY from '@/graphql/queries/DeleteOntLibrary.mutation.gql'
import PrinterModal from '@/components/PrinterModal'
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'
import Alert from '@/components/Alert'

export default {
  name: 'OntLibraries',
  mixins: [Helper, TableHelper],
  components: {
    Alert,
    PrinterModal
  },
  data () {
    return { 
      fields: [
        { key: 'id', label: 'ID' , sortable: true},
        { key: 'name', label: 'Name', sortable: true},
        { key: 'poolSize', label: 'Pool Size', sortable: true},
        { key: 'tubeBarcode', label: 'Tube Barcode' , sortable: true},
        { key: 'plateBarcode', label: 'Plate Barcode', sortable: true},
        { key: 'pool', label: 'Pool #', sortable: true},
        { key: 'createdAt', label: 'Created at', sortable: true},
      ],
      selected: [],
      sortBy: 'createdAt',
      sortDesc: true,
    }
  },
  apollo: {
    libraries: {
      query: LIBRARIES_ALL_QUERY,
      variables () {
        return {
          unassignedToFlowcells: true,
        }
      },
    }
  },
  methods: {
    handleLibraryDelete() {
      const libraryName = this.selected[0].name
      this.$apollo.mutate({
        mutation: DELETE_ONT_LIBRARY,
        variables: {
          libraryName
        }
      }).then(data => {
        let response = data.data.deleteOntLibrary
        if (response.errors.length > 0) {
          this.showAlert(`Failure deleting library '${libraryName}': ` + data.data.deleteOntLibrary.errors.join(', '), 'danger')
        } else {
          this.showAlert(`Library '${libraryName}' was successully deleted`, 'success')
          this.refetchLibraries()
        }
      })
    },
    refetchLibraries() {
      this.$apollo.queries.libraries.refetch()
    }
  },
  created () {
    this.refetchLibraries()
  }
}

</script>


