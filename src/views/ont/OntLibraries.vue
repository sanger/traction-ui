<template>
  <div class="ont-libraries">
    <b-table 
      id="libraries-table"
      hover 
      bordered
      responsive
      :items="libraries"
      :fields="fields"
      sticky-header
      show-empty
    >
    </b-table>
  </div>
</template>

<script>
import LIBRARIES_ALL_QUERY from '@/graphql/queries/LibrariesAll.query.gql'

export default {
  name: 'OntLibraries',
  data () {
    return { 
      fields: [
        { key: 'id', label: 'ID' , sortable: true},
        { key: 'name', label: 'Name', sortable: true},
        { key: 'poolSize', label: 'Pool Size', sortable: true},
        { key: 'tubeBarcode', label: 'Tube Barcode' , sortable: true},
        // { key: 'wellRange', label: 'Wells', sortable: true},
        { key: 'tagSetName', label: 'Tag Set', sortable: true},
        { key: 'plateBarcode', label: 'Plate Barcode', sortable: true},
        { key: 'pool', label: 'Pool #', sortable: true},
      ]
    }
  },
  apollo: {
    libraries: {
      query: LIBRARIES_ALL_QUERY
    }
  }
}

</script>


