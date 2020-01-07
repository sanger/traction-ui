<template>
  <g>
    <defs>
      <filter id="blurFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
    </defs>
    <ellipse v-on:drop="drop" v-on:dragover="allowDrop" v-on:dragleave="endDrop" v-bind:class="[{filled: hasLibraries, active: hover}, position]" :cx="cx" :cy="cy" :rx="rx" :ry="ry" v-on:click="showModal" >
      <title v-if="hasLibraries" v-text="tooltip"></title>
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
      this.hover = false
    },
    // TODO: show alert is not working on error
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
    tooltip () {
      let well = this.well(this.position)
      return well.libraries.map(l =>  l.barcode).join(',')
    },
    hasLibraries () {
      let well = this.well(this.position)
      if (well === undefined) return false
      return well.libraries.length > 0
    }
  },
  mounted() {
  },
  components: {
    WellModal
  }
}
</script>

<style scoped lang="scss">
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
  // need to sort to add blur
  .active {
    stroke: #ffffff;
    filter: url(#blurFilter);
  }
</style>
