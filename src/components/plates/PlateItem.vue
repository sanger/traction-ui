<template>
  <div>
    <Plate96SVG
      v-if="wells"
      ref="plate96Svg"
      :height="widthSVG"
      :width="heightSVG"
    >
      <Well
        v-for="(well, position) in plateMap.wells"
        :key="position"
        ref="well"
        v-bind="well"
        :well_info="getWellAt(position)"
      >
      </Well>
    </Plate96SVG>
  </div>
</template>

<script>
import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import Well from '@/components/plates/WellItem'

export default {
  name: 'PlateItem',
  components: {
    Plate96SVG,
    Well,
  },
  props: {
    plate: {
      type: Object,
      default() {
        return {}
      },
    },
    width: {
      type: String,
      required: false,
      default: '',
    },
    height: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      wells: this.plate.wells,
    }
  },
  computed: {
    plateMap() {
      return PlateMap
    },
    widthSVG() {
      return this.width ? `'${this.width}%'` : '30%'
    },
    heightSVG() {
      return this.width ? `'${this.width}%'` : '30%'
    },
  },
  methods: {
    getWellAt(position) {
      let well = this.wells.find((well) => well.position == position)
      return well && well.materials ? well : { position, materials: [] }
    },
  },
}
</script>
