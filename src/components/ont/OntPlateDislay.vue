<template>

  <b-card>
    <OntPlate v-bind:wells="wells"></OntPlate>
  </b-card>

</template>

<script>

import OntPlate from '@/components/ont/OntPlate'
import gql from 'graphql-tag'

export default {
  name: 'OntPlateDisplay',
  props: ['plate_id'],
  components: {
    OntPlate
  },
  apollo: {
    wells: {
      query: gql`query wells($plateId: Int!) {
        wells(plateId: $plateId) {
          id
          position
          # materials {
          #   name
          # }
        }
      }`,
      variables () {
        return {
          plateId: this.plate_id,
        }
      },
    },
  }
}

</script>