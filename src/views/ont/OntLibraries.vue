<template>
  <div class="ont-libraries">
    <b-table 
      id="libraries-table"
      hover 
      bordered
      responsive
      :items="libraries"
      :fields="fields"
      selectable
      select-mode="multi"
      @row-selected="onRowSelected"
      sticky-header
      show-empty>
    </b-table>
    
    <div class="clearfix">
      <printerModal class="float-left"
                    @selectPrinter="handlePrintLabel"
                    :disabled="this.selected.length === 0">
      </printerModal>
    </div>
  </div>
</template>

<script>
import LIBRARIES_ALL_QUERY from '@/graphql/queries/LibrariesAll.query.gql'
import PrinterModal from '@/components/PrinterModal'
import Helper from '@/mixins/Helper'
import TableHelper from '@/mixins/TableHelper'

export default {
  name: 'OntLibraries',
  mixins: [Helper, TableHelper],
  components: {
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
    }
  },
  apollo: {
    libraries: {
      query: LIBRARIES_ALL_QUERY
    }
  }
}

</script>


