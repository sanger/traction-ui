<template>
  <div class="grid grod-cold-2 flowcell">
    <div class="position">{{ position }}</div>

    <traction-input
      :id="'libraryBarcode-' + index"
      :model-value="libraryBarcode"
      placeholder="Library barcode"
      type="text"
      @update:model-value="setBarcode"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'SaphyrFlowcell',
  props: {
    position: {
      type: [Number],
      default: 0,
    },
    index: {
      type: [Number],
      default: 0,
    },
  },
  emits: ['alert'],
  computed: {
    ...mapState({
      libraryBarcode(state) {
        return state.currentRun.chip.flowcells[this.index].library.barcode
      },
    }),
  },
  methods: {
    async setBarcode(barcode) {
      const isValid = await this.isLibraryBarcodeValid(barcode)

      if (isValid) {
        const libraryTube = await this.getTubeForBarcode(barcode)
        const payload = {
          library: { id: libraryTube.material_id, barcode: libraryTube.barcode },
          flowcellIndex: this.index,
        }

        this.setLibraryBarcode(payload)
      } else {
        this.alert('Library is not valid', 'danger')
      }
    },
    ...mapActions(['isLibraryBarcodeValid', 'getTubeForBarcode']),
    ...mapMutations(['setLibraryBarcode']),
    alert(message, type) {
      this.$emit('alert', message, type)
    },
  },
}
</script>
