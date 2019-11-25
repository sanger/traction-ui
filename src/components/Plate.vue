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
        <ellipse v-for="(well, key) in plateMap.wells" :class="key" :cx="well.cx" :cy="well.cy" :rx="well.rx" :ry="well.ry" v-bind:key="key">
          <title>{{showBarcode(key)}}</title>
        </ellipse>
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

    <WellModal ref="modal" @alert="alert" v-if="this.selectedWellPosition" :position="selectedWellPosition"></WellModal>
  </div>
</template>

<script>
import WellModal from '@/components/WellModal'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/runs')
import PlateMap from '@/config/PlateMap'

export default {
  name: 'Plate',
  data () {
    return {
      selectedWellPosition: null
    }
  },
  methods: {
    onWellClick(position) {
      this.selectedWellPosition = position
    },
    showBarcode (position) {
      let currentWell = this.well(position)
      if (currentWell) {
        let barcodesList = currentWell.libraries.map(l =>  l.barcode)
        if (barcodesList.length > 0) {
          return barcodesList.join(',')
        }
      }
    },
    alert (message, type) {
      this.$emit('alert', message, type)
    }
  },
  computed: {
    ...mapGetters([
      'currentRun',
      'well'
    ]),
    plateMap () {
      return PlateMap
    }

  },
  mounted() {
    // Add on 'click' event listener for each well,
    // could add on drop, on hover etc
    let ellipseElementArray = [...document.getElementsByTagName("ellipse")]
    let wells = ellipseElementArray.filter(well => well.getAttribute('class'))

    wells.map(well => {
      well.addEventListener('click', () => this.onWellClick(well.getAttribute('class')))
      
      // Please leave. We need to be able to add a function to the element.
      //let element = document.createElementNS("http://www.w3.org/2000/svg","title")
      // document.querySelector(`.${well.getAttribute('class')}`).appendChild(element)
    })
  },
  components: {
    WellModal
  },
  updated() {
    if (this.selectedWellPosition) {
      this.$refs.modal.showModalForPosition()
    }
  },
}
</script>

<style lang="scss">

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

  ellipse {
    transform: matrix(0.91863074,0,0,0.92029059,955.85411,1007.3112);
    stroke: #000000;
    stroke: {
      width: 1px;
      linecap: round;
      linejoin: round;
    }
  }

</style>
