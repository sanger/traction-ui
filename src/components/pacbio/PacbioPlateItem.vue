<template>
  <div>
    <Plate96SVG v-if="wells" ref="plate96Svg" height="75%" width="75%">
      <!-- should be v-bind(getWellAt(well) which should return the well and well from plate map combined ) -->
      <Well v-for="(well, position) in plateMap.wells" :key="position" ref="well" v-bind="well">
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
      wellData: [],
    }
  },
  computed: {
    plateMap() {
      return this.$store.getters['plateMap']
    },
  },
  mounted() {
    // get the wells for the plate using wellList getter
  },
  methods: {
    // this should be pretty much the same. Only difference is we will be using the wells from the store
    getWellAt(position) {
      let well = this.wells.find((well) => well.position == position)
      return well ? well.id : ''
    },
  },
}
</script>
