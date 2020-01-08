<template>
  <div class="plate">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 350 255"
      preserveAspectRatio="xMidYMin"
      >
      <g transform="translate(-970.03125,-1039.9375)" id="layer1">
        <path
          d="m 983.44263,1045.0229 323.20507,0 c 3.4232,0 6.1984,2.7801 6.1984,6.2095 l 0,210.2411 c 0,3.4294 -2.7752,6.2096 -6.1984,6.2096 l -323.20507,0 c -3.42332,0 -6.19846,-2.7802 -6.19846,-6.2096 0,0 0,0 0,0 l 0,-210.2411 c 0,-3.4294 2.77514,-6.2095 6.19846,-6.2095 0,0 0,0 0,0 z"
          id="path5203" />
        <well v-for="(well, key) in plateMap.wells" v-bind="well" v-bind:key="key">
        </well>
        <text
          x="995.9538"
          y="1068.7362"
          transform="scale(0.98960714,1.010502)"
          id="rows">
          <tspan v-for="(row, key) in plateMap.rows" :id="'row' + key" :x="row.x" :y="row.y" class="plate-heading" v-bind:key="key">
            {{ key }}
          </tspan>
        </text>
        <text v-for="(column, key) in plateMap.columns" :id="'column' + key" :x="column.x" :y="column.y" class="plate-heading" v-bind:key="key">
          <tspan>{{ key }}</tspan>
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
import Well from '@/components/Well'
import PlateMap from '@/config/PlateMap'

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
    Well
  }
}
</script>

<style scoped lang="scss">

  path {
    fill:#49afcd;
    fill-opacity:1;
    stroke:#004080;
    stroke-width:1.77258527;
    stroke-linecap:round;
    stroke-linejoin:bevel;
  }

  .plate-heading {
    font: {
      size: 9px;
      weight: bold;
      family: Arial;
    }

    line-height: 125%;

    fill: {
      color: #000000;
      opacity: 1;
    }
  }
</style>
