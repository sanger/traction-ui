<template>
  <div class="plates">
    <b-table 
      id="plates-table"
      hover 
      bordered
      responsive
      :items="plates"
      :fields="fields"
      sticky-header
    >
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2" :id="'details-btn-'+row.item.id">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Plate
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <OntPlateDislay v-bind:plate_id="parseInt(row.item.id)"></OntPlateDislay>
      </template>

    </b-table>
  </div>

</template>

<script>

import OntPlateDislay from '@/components/ont/OntPlateDislay'
import gql from 'graphql-tag'

export default {
  name: 'OntPlates',
  data () {
    return { 
      fields: [ 'id', 'barcode', 'show_details' ],
    }
  },
  components: {
    OntPlateDislay
  },
  apollo: {
    plates: gql`query {
      plates: plates {
        id
        barcode
      }
    }`
  }
}
</script>


