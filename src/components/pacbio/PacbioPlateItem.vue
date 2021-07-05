<template>
  <div>
    <Plate96SVG v-if="wells" ref="plate96Svg" height="75%" width="75%">
      <!-- should be v-bind(getWellAt(well) which should return the well and well from plate map combined ) -->
      <Well
        v-for="(well, position) in plateMap.wells"
        :key="position"
        ref="well"
        v-bind="getWellAt(well, position)"
      >
      </Well>
    </Plate96SVG>
  </div>
</template>

<script>
import Plate96SVG from '@/components/svg/Plate96SVG'
import Well from '@/components/pacbio/PacbioWellItem'

export default {
  name: 'Plate',
  components: {
    Plate96SVG,
    Well,
  },
  props: {
    id: {
      type: String,
      default() {
        return ''
      },
    },
    barcode: {
      type: String,
      default() {
        return ''
      },
    },
    wells: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      plateMap: {},
      wellData: [],
    }
  },
  mounted() {
    this.plateMap = this.$store.getters['plateMap']
    this.wellData = this.$store.getters['traction/pacbio/poolCreate/wellList'](this.wells)
  },
  methods: {
    getWellAt(mapWell, position) {
      let well = this.wellData.find((well) => well.position == position)
      return well ? { ...mapWell, ...well } : mapWell
    },
  },
}
</script>
