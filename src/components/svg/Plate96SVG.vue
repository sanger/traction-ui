<template>
  <svg :width="width" :height="height" viewBox="0 0 350 255" preserveAspectRatio="xMidYMin">
    <g id="layer1" transform="translate(-970.03125,-1039.9375)">
      <path
        id="path5203"
        d="m 983.44263,1045.0229 323.20507,0 c 3.4232,0 6.1984,2.7801 6.1984,6.2095 l 0,210.2411 c 0,3.4294 -2.7752,6.2096 -6.1984,6.2096 l -323.20507,0 c -3.42332,0 -6.19846,-2.7802 -6.19846,-6.2096 0,0 0,0 0,0 l 0,-210.2411 c 0,-3.4294 2.77514,-6.2095 6.19846,-6.2095 0,0 0,0 0,0 z"
      />

      <!-- Slot for a well component -->
      <slot></slot>

      <text id="rows" x="995.9538" y="1068.7362" transform="scale(0.98960714,1.010502)">
        <tspan
          v-for="(row, key) in plateMap.rows"
          :id="'row' + key"
          :key="key"
          :x="row.x"
          :y="row.y"
          class="plate-heading"
        >
          {{ key }}
        </tspan>
      </text>
      <text
        v-for="(column, key) in plateMap.columns"
        :id="'column' + key"
        :key="key"
        :x="column.x"
        :y="column.y"
        class="plate-heading"
      >
        <tspan>{{ key }}</tspan>
      </text>
    </g>
  </svg>
</template>

<script>
import PlateMap from '@/config/PlateMap'

export default {
  name: 'Plate96SVG',
  props: {
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
  },
  computed: {
    plateMap() {
      return PlateMap
    },
  },
}
</script>

<style scoped lang="scss">
path {
  fill: #49afcd;
  stroke: #004080;
  stroke-width: 1.77258527;
}

.plate-heading {
  font: {
    size: 9px;
    weight: bold;
    family: Arial;
  }
}
</style>
