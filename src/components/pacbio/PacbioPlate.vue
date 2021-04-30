<template>
  <Plate96SVG :height="'100%'" :width="'100%'">
    <well v-for="(well, key) in plateMap.wells" :key="key" v-bind="well" @alert="alert"> </well>
  </Plate96SVG>
</template>

<script>
import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import Well from '@/components/pacbio/PacbioWell'

export default {
  name: 'Plate',
  components: {
    Well,
    Plate96SVG,
  },
  data() {
    return {
      selectedWellPosition: null,
    }
  },
  computed: {
    plateMap() {
      return PlateMap
    },
  },
  methods: {
    alert(message, type) {
      this.$emit('alert', message, type)
    },
  },
}
</script>
