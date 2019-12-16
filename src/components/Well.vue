<template>
  <g>
    <ellipse v-on:drop="drop" v-on:dragover="allowDrop" v-bind:class="[{filled: hasLibraries}, position]" :cx="cx" :cy="cy" :rx="rx" :ry="ry" v-on:click="showModal" >
      <title v-text="tooltip"></title>
    </ellipse>
    <foreignObject>
      <WellModal ref="modal" class="modal" @alert="alert" :position="position"></WellModal>
    </foreignObject>
  </g>  
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/runs')
import WellModal from '@/components/WellModal'

export default {
  name: 'Well',
  props: {
    row: {
      type: String,
      required: true
    },
    column: {
      type: String,
      required: true
    },
    cx: {
      type: String,
      required: true
    },
    cy: {
      type: String,
      required: true
    },
    rx: {
      type: String,
      required: true
    },
    ry: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    alert (message, type) {
      this.$emit('alert', message, type)
    },
    showModal () {
      this.$refs.modal.showModalForPosition()
    },
    allowDrop (event) {
      event.preventDefault()
    },
    drop (event) {
      event.preventDefault()
      console.log('dropped')
    }
  },
  computed: {
    ...mapGetters([
      'currentRun',
      'well'
    ]),
    position () {
      return `${this.row}${this.column}`
    },
    libraryBarcodes () {
      let well = this.well(this.position)
      if (well === undefined) return ''
      let barcodesList = well.libraries.map(l =>  l.barcode)
      if (barcodesList.length > 0) {
        return barcodesList.join(',')
      } else {
        return ''
      }
    },
    tooltip () {
      if (this.hasLibraries) {
        return this.libraryBarcodes
      } else {
        return ''
      }  
    },
    hasLibraries () {
      return this.libraryBarcodes.length > 0
    }
  },
  mounted() {
  },
  components: {
    WellModal
  }
}
</script>

<style lang="scss">
  ellipse {
    transform: matrix(0.91863074,0,0,0.92029059,955.85411,1007.3112);
    stroke: #000000;
    stroke: {
      width: 1px;
      linecap: round;
      linejoin: round;
    }
  }
  .filled {
    fill: purple;
  }
</style>
