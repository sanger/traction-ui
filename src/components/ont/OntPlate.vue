<template>
  <Plate384SVG v-if="wells">
    <OntWell v-for="(well, position) in plateMap.wells" v-bind="well" v-bind:key="position" v-bind:well_info="getWellAt(position)">
    </OntWell>
  </Plate384SVG>
</template>

<script>

import Plate384SVG from '@/components/svg/Plate384SVG'
import PlateMap from '@/config/PlateMap'
import OntWell from '@/components/ont/OntWell'
import gql from 'graphql-tag'

export default {
  name: 'OntPlate',
  props: ['plate_id'],
  components: {
    Plate384SVG,
    OntWell,
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
  },
  methods: {
    getWellAt(position) {
      let well = this.wells.filter(well => well.position == position)[0]

      return well ? well : this.createEmptyWell(position)
    },
    createEmptyWell(position) {
      return { position: position, material: {} }
    }
  },
  computed: {
    plateMap () {
      return PlateMap
    }
  }
}

</script>