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
      v-if="hasPoolsOrLibraries && hover"
      class="absolute z-1 bg-black text-white text-xs p-2 rounded"
      data-attribute="tooltip"
    >
      {{ tooltip }}
    </span>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'

export default {
  name: 'PacbioRunWell',
  props: {
    position: {
      type: String,
      required: true,
    },
    plateNumber: {
      type: Number,
      required: true,
    },
    interactive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  emits: ['click'],
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    ...mapState(usePacbioRunCreateStore, [
      'tubeContentByBarcode',
      'getWell',
      'tubeContents',
      'smrtLinkVersion',
      'getOrCreateWell',
    ]),
    wellClassNames() {
      return [
        this.status,
        this.hover && this.interactive
          ? 'ring ring-pink-600 ring-offset-1'
          : 'border border-gray-800',
        this.interactive ? 'cursor-pointer' : '',
        'flex flex-col justify-center mx-auto rounded-full text-xs font-semibold aspect-square w-full select-none transition duration-200 ease-out',
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
        ?.map((p) => {
          return this.tubeContents.find((tubeContent) => p == tubeContent.id).barcode
        })
        .concat(
          this.storeWell.libraries?.map((l) => {
            return this.tubeContents.find((tubeContent) => l == tubeContent.id).barcode
          }),
        )
        .filter(Boolean)
        .join(',')
    },
    hasPoolsOrLibraries() {
      if (this.storeWell === undefined) return false
      return this.storeWell.pools.length > 0 || this.storeWell.libraries.length > 0
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
      return this.getWell(this.plateNumber, this.position)
    },
    status() {
      if (this.hasPoolsOrLibraries && this.hasValidMetadata) {
        // Complete
        return 'bg-success text-white'
      } else if (this.hasPoolsOrLibraries || this.hasSomeMetadata) {
        // Incomplete
        return 'bg-failure text-white'
      }
      // Empty
      return 'bg-gray-100 text-black'
    },
  },
  methods: {
    ...mapActions(usePacbioRunCreateStore, ['updateWell']),
    onClick() {
      this.$emit('click', this.position, this.plateNumber)
    },
    async drop(event) {
      this.hover = false
      await this.updatePoolLibraryBarcode(event.dataTransfer.getData('barcode'))
    },
    async updatePoolLibraryBarcode(barcode) {
      const well = await this.getOrCreateWell(this.position, this.plateNumber)
      const { id, type } = this.tubeContentByBarcode(barcode)
      console.log(well)
      type === 'libraries' ? well.libraries.push(id) : type === 'pools' ? well.pools.push(id) : null
      this.updateWell({ well: well, plateNumber: this.plateNumber })
    },
  },
}
</script>
