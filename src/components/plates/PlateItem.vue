<template>
  <div>
    <Plate96SVG v-if="wells" ref="plate96Svg" :height="computedHeight" :width="computedWidth">
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
      type: [String, Number],
      required: false,
      default: '',
    },
    height: {
      type: [String, Number],
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
    computedWidth() {
      return this.width ? `${this.width}%` : '30%'
    },
    computedHeight() {
      return this.height ? `${this.height}%` : '30%'
    },
  },
  methods: {
    getWellAt(position) {
      const well = this.wells.find((well) => well.position == position)
      return well && well.requests ? well : { position, requests: [] }
    },
  },
}
</script>
