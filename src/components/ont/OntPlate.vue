<template>

  <div class="plate">
    <!-- REFACTOR: SVG is copied from Plate.vue -->
    <svg
      width="50%"
      height="50%"
      viewBox="0 0 350 255"
      preserveAspectRatio="xMidYMin"
      >
      <g transform="translate(-970.03125,-1039.9375)" id="layer1">
        <path
          d="m 983.44263,1045.0229 323.20507,0 c 3.4232,0 6.1984,2.7801 6.1984,6.2095 l 0,210.2411 c 0,3.4294 -2.7752,6.2096 -6.1984,6.2096 l -323.20507,0 c -3.42332,0 -6.19846,-2.7802 -6.19846,-6.2096 0,0 0,0 0,0 l 0,-210.2411 c 0,-3.4294 2.77514,-6.2095 6.19846,-6.2095 0,0 0,0 0,0 z"
          id="path5203" />

        <OntWell v-for="(well, position) in plateMap.wells" v-bind="well" v-bind:key="position" v-bind:well_info="getWellAt(position)">
        </OntWell>

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

import OntWell from '@/components/ont/OntWell'
import PlateMap from '@/config/PlateMap'

export default {
  name: 'OntPlate',
  props: ['wells'],
  methods: {
    getWellAt(position) {
      let well = this.wells.filter(well => well.position == position)[0]
      
      return well ? well : this.createEmptyWell(position)
    },
    createEmptyWell(position) {
      return { position: position, material: {} }
    }
  },
  computed: {
    plateMap () {
      return PlateMap
    }
  },
  components: {
    OntWell
  }
}
</script>

<style scoped lang="scss">

// REFACTOR: Styling is copied from Plate.vue 

  path {
    fill:#49afcd;
    stroke:#004080;
    stroke-width:1.77258527;
  }

  .plate-heading {
    font: {
      size: 9px;
      weight: bold;
      family: Arial;
    }
  }
</style>
