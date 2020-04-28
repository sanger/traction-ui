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
      show-empty
    >
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" variant="outline-primary" :id="'details-btn-'+row.item.id">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Plate
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <OntPlate v-bind:plate_id="parseInt(row.item.id)"></OntPlate>
      </template>
    </b-table>
  </div>
</template>

<script>

import OntPlate from '@/components/ont/OntPlate'
import gql from 'graphql-tag'

export default {
  name: 'OntPlates',
  data () {
    return { 
      fields: [ 'id', 'barcode', 'show_details' ],
    }
  },
  components: {
    OntPlate,
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


