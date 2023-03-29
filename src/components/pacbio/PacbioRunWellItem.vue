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
      <title v-if="hasPools" v-text="tooltip"></title>
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
  name: 'PacbioRunWellItem',
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
        // Below doesn't include 'pre_extension_time' or 'ccs_analysis_output'
        // as they have default values
        return [
          'movie_time',
          'on_plate_loading_concentration',
          'binding_kit_box_barcode',
          'generate_hifi',
        ]
      },
    },
  },
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runCreate', ['poolByBarcode', 'getWell', 'pools']),
    position() {
      return `${this.row}${this.column}`
    },
    tooltip() {
      return this.storeWell.pools
        .map((p) => {
          return this.pools.find((pool) => p == pool.id).barcode
        })
        .join(',')
    },
    hasPools() {
      if (this.storeWell === undefined) return false
      return this.storeWell.pools.length > 0
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
      return this.getWell(this.position)
    },
    status() {
      if (this.hasPools && this.hasValidMetadata) {
        return 'complete'
      } else if (this.hasPools || this.hasSomeMetadata) {
        return 'filled'
      } else {
        return 'empty'
      }
    },
  },
  methods: {
    ...mapActions('traction/pacbio/runCreate', ['getOrCreateWell']),
    ...mapMutations('traction/pacbio/runCreate', ['updateWell']),
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
    // TODO: why does this need to be async??
    async updatePoolBarcode(barcode) {
      const well = await this.getOrCreateWell({ position: this.position })
      const { id } = this.poolByBarcode(barcode)
      well.pools.push(id)
      this.updateWell(well)
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
