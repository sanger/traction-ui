<template>
  <div class="ont-libraries">
    <b-table
      id="libraries-table"
      ref="table"
      hover
      bordered
      responsive
      :items="getLibraries"
      :fields="fields"
      selectable
      select-mode="single"
      sticky-header
      show-empty
      :per-page="perPage"
      :current-page="currentPage"
      @row-selected="onRowSelected"
    >
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"> </b-pagination>

    <span class="font-weight-bold">Total records: {{ totalRows }}</span>

    <div class="clearfix">
      <printerModal
        ref="printerModal"
        class="float-left"
        :disabled="selected.length === 0"
        @selectPrinter="handlePrint"
      >
      </printerModal>

      <b-button
        id="deleteLibrary-btn"
        variant="danger"
        class="float-left"
        :disabled="selected.length === 0"
        @click="handleLibraryDelete"
      >
        Delete Library
      </b-button>
    </div>
  </div>
</template>

<script>
import LIBRARIES_ALL_QUERY from '@/graphql/queries/LibrariesAll.query.gql'
import DELETE_ONT_LIBRARY from '@/graphql/queries/DeleteOntLibrary.mutation.gql'
import PrinterModal from '@/components/PrinterModal'
import PrintHelper from '@/mixins/PrintHelper'
import TableHelper from '@/mixins/TableHelper'

export default {
  name: 'OntLibraries',
  components: {
    PrinterModal,
  },
  mixins: [PrintHelper, TableHelper],
  data() {
    return {
      fields: [
        'id',
        'name',
        'poolSize',
        'tubeBarcode',
        'plateBarcode',
        'pool',
        'createdAt',
        'assignedToFlowcell',
      ],
      selected: [],
      perPage: 5,
      currentPage: 1,
      totalRows: 0,
    }
  },
  methods: {
    async handlePrint(printer) {
      await this.handlePrintLabel(printer)
    },
    getLibraries(ctx, callback) {
      this.$apollo
        .query({
          query: LIBRARIES_ALL_QUERY,
          variables: {
            unassignedToFlowcells: false,
            pageNum: ctx.currentPage,
            pageSize: ctx.perPage,
          },
          fetchPolicy: 'no-cache',
        })
        .then((data) => {
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
      this.$apollo
        .mutate({
          mutation: DELETE_ONT_LIBRARY,
          variables: {
            libraryName,
          },
        })
        .then((data) => {
          let response = data.data.deleteOntLibrary
          if (response.errors.length > 0) {
            this.showAlert(
              `Failure deleting library '${libraryName}': ` +
                data.data.deleteOntLibrary.errors.join(', '),
              'danger',
            )
          } else {
            this.showAlert(`Library '${libraryName}' was successully deleted`, 'success')
            this.refetchLibraries()
          }
        })
    },
    refetchLibraries() {
      this.$refs.table.refresh()
    },
  },
}
</script>
