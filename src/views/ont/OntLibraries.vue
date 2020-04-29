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
        { key: 'tubeBarcode', label: 'Tube Barcode' },
        { key: 'plateBarcode', label: 'Plate Barcode'},
        { key: 'pool', label: 'Pool'},
        { key: 'name', label: 'Name'},
        { key: 'wells', label: 'Wells'},
        { key: 'tagSet', label: 'Tag Set'},
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


