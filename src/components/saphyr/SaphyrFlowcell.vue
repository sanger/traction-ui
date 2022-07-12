<template>
  <traction-row class="flowcell">
    <traction-col>
      <div class="position">{{ position }}</div>

      <traction-input
        :id="'libraryBarcode-' + index"
        :value="libraryBarcode"
        placeholder="Library barcode"
        type="text"
        @change="setBarcode"
      />
    </traction-col>
  </traction-row>
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
  computed: {
    ...mapState({
      libraryBarcode(state) {
        return state.currentRun.chip.flowcells[this.index].library.barcode
      },
    }),
  },
  methods: {
    async setBarcode(barcode) {
      let isValid = await this.isLibraryBarcodeValid(barcode)

      if (isValid) {
        let libraryTube = await this.getTubeForBarcode(barcode)
        let container_material = libraryTube.materials[0]
        let payload = {
          library: { id: container_material.material_id, barcode: container_material.barcode },
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
