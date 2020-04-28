<template>
  <div>
    <PoolSamplesModal v-bind:plate_id="plate_id"></PoolSamplesModal>
    <Plate96SVG v-if="wells">
      <OntWell v-for="(well, position) in plateMap.wells" v-bind="well" v-bind:key="position" v-bind:well_info="getWellAt(position)">
      </OntWell>
    </Plate96SVG>
  </div>
</template>

<script>

import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import OntWell from '@/components/ont/OntWell'
import PoolSamplesModal from '@/components/ont/PoolSamplesModal'
import gql from 'graphql-tag'

export default {
  name: 'OntPlate',
  props: ['plate_id'],
  components: {
    Plate96SVG,
    OntWell,
    PoolSamplesModal
  },
  apollo: {
    wells: {
      query: gql`query wells($plateId: Int!) {
        wells(plateId: $plateId) {
          id
          position
          material {
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