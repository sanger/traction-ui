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
        { key: 'id', label: 'ID' },
        { key: 'poolSize', label: 'Pool'},
        { key: 'wellRange', label: 'Wells'},
        { key: 'name', label: 'Name'},
        { key: 'tagSet', label: 'Tag Set'},
        { key: 'tubeBarcode', label: 'Tube Barcode' },
        { key: 'plateBarcode', label: 'Plate Barcode'},
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


