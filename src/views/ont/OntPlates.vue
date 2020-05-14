<template>
  <div class="ont-plates">
    <alert ref='alert'></alert>

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
        <OntPlate v-bind:plate="row.item" @alert="alert"></OntPlate>
      </template>
    </b-table>
  </div>
</template>

<script>

import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import OntPlate from '@/components/ont/OntPlate'
import PLATES_ALL_QUERY from '@/graphql/queries/PlatesAll.query.gql'

export default {
  name: 'OntPlates',
  data () {
    return { 
      fields: [ 'id', 'barcode', 'show_details' ],
    }
  },
  components: {
    OntPlate,
    Alert
  },
  mixins: [Helper],
  apollo: {
    plates: {
      query: PLATES_ALL_QUERY
    }
  },
  methods: {
    alert(message, type) {
      this.showAlert(message, type)
    }
  }
}
</script>


