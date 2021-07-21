<template>
  <g>
    <defs>
      <filter id="blurFilter">
        <feGaussianBlur in="SourceGraphic" std-deviation="1" />
      </filter>
    </defs>
    <ellipse
      :class="[{ active: hover }, status]"
      :cx="cx"
      :cy="cy"
      :rx="rx"
      :ry="ry"
      @drop="drop"
      @dragover="allowDrop"
      @dragleave="endDrop"
      @click="showModal"
    >
      <title v-if="hasLibraries" v-text="tooltip"></title>
    </ellipse>
    <foreignObject>
      <WellEdit ref="modal" class="modal" :position="position" @alert="alert"></WellEdit>
    </foreignObject>
  </g>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'

export default {
  name: 'PacbioRunWellEdit',
  components: {
    WellEdit,
  },
  props: {
    row: {
      type: String,
      required: true,
    },
    column: {
      type: String,
      required: true,
    },
    cx: {
      type: String,
      required: true,
    },
    cy: {
      type: String,
      required: true,
    },
    rx: {
      type: String,
      required: true,
    },
    ry: {
      type: String,
      required: true,
    },
    // eslint-disable-next-line vue/prop-name-casing
    required_metadata_fields: {
      type: Array,
      default() {
        // Below doesn't include 'generate_hifi', 'pre_extension_time' or 'ccs_analysis_output'
        // as they have deafult values
        return ['movie_time', 'insert_size', 'on_plate_loading_concentration']
      },
    },
  },
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runs', ['well']),
    ...mapGetters('traction/pacbio/pools', ['poolByBarcode']),
    position() {
      return `${this.row}${this.column}`
    },
    tooltip() {
      return this.storeWell.libraries.map((l) => l.barcode).join(',')
    },
    hasLibraries() {
      if (this.storeWell === undefined) return false
      if (this.storeWell.libraries.every((l) => l.barcode == '')) return false
      return this.storeWell.libraries.length > 0
    },
    hasValidMetadata() {
      if (this.storeWell === undefined) return false
      return this.required_metadata_fields.every((field) => this.storeWell[field] !== '')
    },
    hasSomeMetadata() {
      if (this.storeWell === undefined) return false
      return this.required_metadata_fields.some((field) => this.storeWell[field] !== '')
    },
    storeWell() {
      return this.well(this.position)
    },
    status() {
      if (this.hasLibraries && this.hasValidMetadata) {
        return 'complete'
      } else if (this.hasLibraries || this.hasSomeMetadata) {
        return 'filled'
      } else {
        return 'empty'
      }
    },
  },
  methods: {
    ...mapActions('traction/pacbio/tubes', ['getTubeForBarcode']),
    ...mapMutations('traction/pacbio/runs', ['addPoolToWell']),
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    showModal() {
      this.$refs.modal.showModalForPosition()
    },
    allowDrop(event) {
      event.preventDefault()
      this.hover = true
    },
    endDrop(event) {
      event.preventDefault()
      this.hover = false
    },
    async drop(event) {
      event.preventDefault()
      await this.updatePoolBarcode(event.dataTransfer.getData('barcode'))
      this.hover = false
    },
    async updatePoolBarcode(barcode) {
      let poolId = this.poolByBarcode(barcode).id
      let payload = { position: this.position, with: { id: poolId, barcode: barcode } }
      this.addPoolToWell(payload)
    },
  },
}
</script>

<style scoped lang="scss">
ellipse {
  transform: matrix(0.91863074, 0, 0, 0.92029059, 955.85411, 1007.3112);
  stroke: #000000;
  stroke: {
    width: 1px;
    linecap: round;
    linejoin: round;
  }
}
.complete {
  fill: green;
}
.filled {
  fill: red;
}
.active {
  stroke: #ffffff;
  filter: url(#blurFilter);
}
</style>
