<template>
  <Plate96SVG v-if="wells" width="30%" height="30%">
    <OntWell v-for="(well, position) in plateMap.wells" v-bind="well" v-bind:key="position" v-bind:well_info="getWellAt(position)">
    </OntWell>
  </Plate96SVG>
</template>

<script>

import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import OntWell from '@/components/ont/OntWell'
import gql from 'graphql-tag'

export default {
  name: 'OntPlate',
  props: ['plate_id'],
  components: {
    Plate96SVG,
    OntWell,
  },
  apollo: {
    wells: {
      query: gql`query wells($plateId: Int!) {
        wells(plateId: $plateId) {
          id
          position
          materials {
            ...on Request {
              sample {
                name
              }
            }
          }
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

      return well ? well : { position: position, material: {} }
    }
  },
  computed: {
    plateMap () {
      return PlateMap
    }
  }
}

</script>