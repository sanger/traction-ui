<template>
  <div data-type="plate-item">
    <Plate96SVG v-if="wells" ref="plate96Svg" height="100%" width="100%">
      <Well
        v-for="well in mappedWells"
        :key="well.position"
        ref="well"
        v-bind="well"
        @click="clickWell(well.id)"
      >
      </Well>
    </Plate96SVG>
  </div>
</template>

<script>
import Plate96SVG from '@/components/svg/Plate96SVG'
import Well from '@/components/pacbio/PacbioWellItem'

export default {
  name: 'PacbioPlateItem',
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
      wellData: [],
    }
  },
  computed: {
    mappedWells() {
      return Object.entries(this.plateMap.wells).map(([position, mapWell]) => {
        return this.getWellAt(mapWell, position)
      })
    },
    plateMap() {
      return this.$store.getters.plateMap
    },
  },
  mounted() {
    this.wellData = this.$store.getters['traction/pacbio/poolCreate/wellList'](this.wells)
  },
  methods: {
    getWellAt(mapWell, position) {
      const well = this.wellData.find((well) => well.position == position)
      return well ? { ...mapWell, ...well } : mapWell
    },
    clickWell(id) {
      this.$emit('clickWell', id)
    },
  },
}
</script>
