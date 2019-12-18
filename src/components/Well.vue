<template>
  <g>
    <defs>
      <!-- filter id="blurFilter" y="-2" height="10" -->
      <filter id="blurFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
      </filter>
    </defs>
    <ellipse v-on:drop="drop" v-on:dragover="allowDrop" v-on:dragleave="endDrop" v-bind:class="[{filled: hasLibraries, active: hover}, position]" :cx="cx" :cy="cy" :rx="rx" :ry="ry" v-on:click="showModal" >
      <title v-text="tooltip"></title>
    </ellipse>
    <foreignObject>
      <WellModal ref="modal" class="modal" @alert="alert" :position="position"></WellModal>
    </foreignObject>
  </g>  
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapMutations, mapGetters } = createNamespacedHelpers('traction/pacbio/runs')
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
      hover: false
    }
  },
  methods: {
     ...mapActions([
    'isLibraryBarcodeValid',
    'getTubeForBarcode',
  ]),
  ...mapMutations([
    'mutateWell',
    'addEmptyLibraryToWell',
    'removeLibraryFromWell',
    'addLibraryToWell'
  ]),
    alert (message, type) {
      this.$emit('alert', message, type)
    },
    showModal () {
      this.$refs.modal.showModalForPosition()
    },
    allowDrop (event) {
      event.preventDefault()
      this.hover = true
    },
    endDrop (event) {
      event.preventDefault()
      this.hover = false
    },
    async drop (event) {
      event.preventDefault()
      await this.updateLibraryBarcode(event.dataTransfer.getData('barcode'))
    },
    async updateLibraryBarcode(barcode) {
      let isValid = await this.isLibraryBarcodeValid(barcode)

      if (isValid) {
        let libraryTube = await this.getTubeForBarcode(barcode)
        let library = libraryTube.material
        let payload = { position: this.position, with: { id: library.id, barcode: library.barcode }}
        this.addLibraryToWell(payload)
      } else {
        this.showAlert('Library is not valid', 'danger')
      }
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
  .active {
    stroke: #ffffff;
    filter: url(#blurFilter);
  }
</style>
