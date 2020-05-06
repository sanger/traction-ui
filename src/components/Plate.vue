<template>
  <Plate96SVG width="75%" height="75%">
    <well v-for="(well, key) in plateMap.wells" v-bind="well" v-bind:key="key">
    </well>
  </Plate96SVG>
</template>

<script>

import Plate96SVG from '@/components/svg/Plate96SVG'
import PlateMap from '@/config/PlateMap'
import Well from '@/components/Well'

export default {
  name: 'Plate',
  data () {
    return {
      selectedWellPosition: null
    }
  },
  computed: {
    plateMap () {
      return PlateMap
    }
  },
  components: {
    Well,
    Plate96SVG
  }
}
</script>
