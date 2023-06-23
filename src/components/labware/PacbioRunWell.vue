<template>
  <div>
    <div
      :class="wellClassNames"
      data-attribute="pacbio-run-well"
      @mouseover.prevent="hover = true"
      @mouseleave.prevent="hover = false"
      @drop.prevent="drop"
      @dragenter.prevent
      @dragover.prevent="hover = true"
      @dragleave.prevent="hover = false"
      @click="onClick"
    >
      <p class="truncate font-light">{{ position }}</p>
    </div>
    <span
      v-if="hasPools && hover"
      class="absolute z-1 bg-black text-white text-xs p-2 rounded"
      data-attribute="tooltip"
    >
      {{ tooltip }}
    </span>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

const PLATE_INDEX = 0

export default {
  name: 'PacbioRunWell',
  props: {
    position: {
      type: String,
      required: true,
    },
    interactive: {
      type: Boolean,
      required: true,
      default: true,
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
    wellClassNames() {
      return [
        this.status,
        this.hover && this.interactive
          ? 'ring ring-pink-600 ring-offset-1'
          : 'border border-gray-800',
        this.interactive ? 'cursor-pointer' : '',
        'flex flex-col justify-center mx-auto rounded-full text-xs font-semibold aspect-square w-full select-none',
      ]
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
      return this.getWell(this.position, PLATE_INDEX)
    },
    status() {
      if (this.hasPools && this.hasValidMetadata) {
        // Complete
        return 'bg-green-200 text-black'
      } else if (this.hasPools || this.hasSomeMetadata) {
        // Incomplete
        return 'bg-red-200 text-black'
      }
      // Empty
      return 'bg-gray-100 text-black'
    },
  },
  methods: {
    ...mapActions('traction/pacbio/runCreate', ['getOrCreateWell']),
    ...mapMutations('traction/pacbio/runCreate', ['updateWell']),
    onClick() {
      this.$emit('click', this.position)
    },
    async drop(event) {
      this.hover = false
      await this.updatePoolBarcode(event.dataTransfer.getData('barcode'))
    },
    // It looks like all actions are async even if they do nothing async
    async updatePoolBarcode(barcode) {
      const well = await this.getOrCreateWell({ position: this.position, plateIndex: PLATE_INDEX })
      const { id } = this.poolByBarcode(barcode)
      well.pools.push(id)
      this.updateWell({ well: well, plateIndex: PLATE_INDEX })
    },
  },
}
</script>