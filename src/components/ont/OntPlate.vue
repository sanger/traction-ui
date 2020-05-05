<template>
  <div>
    <PoolSamplesModal class="float-right" v-bind:plate_barcode="plate.barcode"></PoolSamplesModal>
    <Plate96SVG v-if="wells" v-bind:height="'30%'" v-bind:width="'30%'">
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
import WELLS_ALL_FOR_PLATE_QUERY from '@/graphql/queries/WellsAllForPlate.query.gql'

export default {
  name: 'OntPlate',
  props: ['plate'],
  components: {
    Plate96SVG,
    OntWell,
    PoolSamplesModal
  },
  apollo: {
    wells: {
      query: WELLS_ALL_FOR_PLATE_QUERY,
      variables () {
        return {
          plateId: parseInt(this.plate.id),
        }
      },
    }
  },
  methods: {
    getWellAt(position) {
      let well = this.wells.filter(well => well.position == position)[0]
      return well ? well : { position: position, materials: [] }
    }
  },
  computed: {
    plateMap () {
      return PlateMap
    }
  }
}

</script>