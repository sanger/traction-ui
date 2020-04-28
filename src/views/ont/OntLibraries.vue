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
// import gql from 'graphql-tag'

export default {
  name: 'OntLibraries',
  data () {
    return { 
      fields: [ 'id', 'tube_barcode', 'plate_barcode', 'pool', 'wells', 'tag_set' ],
      libraries: [
        { id: 1, tube_barcode: 'TRAC-2-1', plate_barcode: 'TRAC-1-1', pool: 1, name: 'TRAC-1-1-1', wells: 'A1-H3', tag_set: 24 },
        { id: 2, tube_barcode: 'TRAC-2-2', plate_barcode: 'TRAC-1-1', pool: 2, name: 'TRAC-1-1-2', wells: 'A4-H6', tag_set: 24 },
        { id: 3, tube_barcode: 'TRAC-2-3', plate_barcode: 'TRAC-1-1', pool: 3, name: 'TRAC-1-1-3', wells: 'A7-H9', tag_set: 24 },
        { id: 4, tube_barcode: 'TRAC-2-4', plate_barcode: 'TRAC-1-1', pool: 4, name: 'TRAC-1-1-4', wells: 'A10-H12', tag_set: 24 },
        { id: 5, tube_barcode: 'TRAC-2-5', plate_barcode: 'TRAC-1-2', pool: 1, name: 'TRAC-1-2-1', wells: 'A1-H12', tag_set: 96 },
      ]
    }
  },
  // apollo: {
  //   libraries: gql`query {
  //     libraries: libraries {
  //       id
  //       tube_barcode
  //       plate_barcode
  //       pool
  //       wells
  //       tag_set
  //     }
  //   }`
  // }
}

</script>


