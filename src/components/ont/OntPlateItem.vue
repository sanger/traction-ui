<template>
  <div data-type="plate-item">
    <Plate96SVG v-if="wells" data-attribute="plate96Svg" height="100%" width="100%">
      <Well
        v-for="well in mappedWells"
        :key="well.position"
        data-attribute="well"
        v-bind="well"
        @click="clickWell(well.id)"
      >
      </Well>
    </Plate96SVG>
  </div>
</template>

<script>
import Plate96SVG from '@/components/svg/Plate96SVG'
import Well from '@/components/ont/OntWellItem'

/**
 * # OntPlateItem
 *
 * Displays an SVG of a 96 well plate with well selection ability
 */
// TODO: ONT store: Does this need to be moved to top level ONT?
export default {
  name: 'OntPlateItem',
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
  emits: ['clickWell'],
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
    this.wellData = this.$store.getters['traction/ont/pools/wellList'](this.wells)
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
