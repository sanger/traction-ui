<template>

  <b-card>
    <OntPlate v-bind:wells="this.getPlate().wells"></OntPlate>
  </b-card>
  
</template>

<script>

import OntPlate from '@/components/ont/OntPlate'

export default {
  name: 'OntPlateDisplay',
  props: ['plate_id'],
  components: {
    OntPlate
  },
  methods: {
    getPlate() {
      // This will be a GraphQL request to get the plate
      // returning the plates well information
      // and the wells material information
      
      // GraphQL request will look something like
      // plate(id: this.plate_id) {
      //   wells {
      //     position
      //     material {
      //       name
      //     }
      //   }
      // }

      // GraphQL response will look something like
      return {
        wells: [
          { 
            position: 'A1',
            material: [
              { name: 'SampleName1' },
              { name: 'SampleName12'}
            ]
          },
          { 
            position: 'A7',
            material: [{
              name: 'SampleName2'
            }]
          }
        ]
      }
    }
  }
}

</script>