<template>
  <Plate384SVG>
    <well v-for="(well, key) in plateMap.wells" v-bind="well" v-bind:key="key">
    </well>
  </Plate384SVG>
</template>

<script>

import Plate384SVG from '@/components/svg/Plate384SVG'
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
    Plate384SVG
  }
}
</script>
