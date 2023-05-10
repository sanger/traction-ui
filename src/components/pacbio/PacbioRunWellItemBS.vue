<!--
  This component is created as part of traction-modal story and is a duplicate for 'PacbioRunWellItem'.
  This exists only to maintain compatibility with bootstrap-modal using feature flags. The custom traction-modal 
  involves some significant changes in the existing component design which involves moving the WellEdit to the 
  parent component 'PacbioRunPlateItem'.
  Inorder to ensure the b-modal implementation of this component works (when the feature flag is turned off),
  it is kept as how it is working now.
  This component can be removed when custom_enable_modal feature flag is removed. 
-->
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
  name: 'PacbioRunWellItemBS',
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
  },
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runCreate', [
      'poolByBarcode',
      'getWell',
      'pools',
      'smrtLinkVersion',
    ]),
    position() {
      return `${this.row}${this.column}`
    },
    required_metadata_fields() {
      if (this.smrtLinkVersion.name == 'v11') {
        return [
          'movie_time',
          'on_plate_loading_concentration',
          'binding_kit_box_barcode',
          'generate_hifi',
        ]
      } else if (this.smrtLinkVersion.name == 'v12_revio') {
        return [
          'movie_acquisition_time',
          'include_base_kinetics',
          'library_concentration',
          'polymerase_kit',
          'pre_extension_time',
        ]
      }
      return []
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
      return this.required_metadata_fields.every((field) => this.storeWell[field])
    },
    hasSomeMetadata() {
      if (this.storeWell === undefined) return false
      return this.required_metadata_fields.some((field) => this.storeWell[field])
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
    // It looks like all actions are async even if they do nothing async
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
