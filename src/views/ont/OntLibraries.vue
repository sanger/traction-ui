<template>
  <div class="ont-libraries">
    <alert ref='alert'></alert>
    <b-table 
      id="libraries-table"
      ref='table'
      hover 
      bordered
      responsive
      :items="getLibraries"
      :fields="fields"
      selectable
      select-mode="single"
      @row-selected="onRowSelected"
      sticky-header
      show-empty
      :per-page="perPage"
      :current-page="currentPage"
    >
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage">
    </b-pagination>
    
    <span class="font-weight-bold">Total records: {{ totalRows }}</span>
    
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
      fields: [ 'id', 'name', 'poolSize', 'tubeBarcode', 'plateBarcode', 'pool', 'createdAt'],
      selected: [],
      perPage: 5,
      currentPage: 1,
      totalRows: 0  
    }
  },
  methods: {
    getLibraries(ctx, callback) {
      this.$apollo.query({
        query: LIBRARIES_ALL_QUERY,
        variables: {
          unassignedToFlowcells: true,
          pageNum: ctx.currentPage,
          pageSize: ctx.perPage
        },
        fetchPolicy: 'no-cache'
      })
      .then(data => {
        this.totalRows = data.data.libraries.pageInfo.entitiesCount
        callback(data.data.libraries.nodes)
      })
      .catch(() => {
        callback([])
      })
      return null
    },
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
      this.$refs.table.refresh()
    }
  },
}

</script>


