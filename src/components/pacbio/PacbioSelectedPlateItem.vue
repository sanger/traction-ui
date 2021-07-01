<template>
  <div>
    <Plate96SVG v-if="wells" ref="plate96Svg" height="75%" width="75%">
        <Well
            v-for="(well, position) in plateMap.wells"
            :key="position"
            ref="well"
            v-bind="well"
            :well-id="getWellAt(position)"
        >
        </Well>
    </Plate96SVG>
  </div>
</template>

<script>
import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import Well from '@/components/pacbio/PacbioSelectedWellItem'

export default {
  name: 'Plate',
  components: {
    Plate96SVG,
    Well,
  },
  props: {
    plateId: {
      type: String,
      default() {
        return ""
      },
    }
  },
  data() {
    return {
        wells: []
    }
  },
  computed: {
    plateMap() {
      return PlateMap
    },
  },
  mounted() {
    this.wells = this.$store.getters['traction/pacbio/poolCreate/plateWells'](this.plateId)
  },
  methods: {
    getWellAt(position) {
        let well = this.wells.find((well) => well.position == position)
        return well ? well.id : ""
    },
  }
}
</script>
