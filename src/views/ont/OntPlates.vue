<template>

  <div class="plates">
    <b-table 
      hover 
      bordered
      responsive
      :items="getPlates"
      :fields="fields"
      sticky-header
    >
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Plate
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <OntPlateDislay v-bind:plate_id="row.item.id"></OntPlateDislay>
      </template>

    </b-table>
  </div>

</template>

<script>

import OntPlateDislay from '@/components/ont/OntPlateDislay'

export default {
  name: 'OntPlates',
  data () {
    return { 
      fields: [ 'id', 'barcode', 'show_details' ]
    }
  },
  components: {
    OntPlateDislay
  },
  methods: {
    getPlates() {
      // GraphQL request will look something like
      // plates {
      //   barcode
      // }

      // GraphQL response will look something like
      return [
        { id: 1, barcode: 'DN-1-1'},
        { id: 2, barcode: 'DN-1-2'},
        { id: 3, barcode: 'DN-1-3'},
        { id: 4, barcode: 'DN-1-4'},
      ]
    }
  }
}
</script>


