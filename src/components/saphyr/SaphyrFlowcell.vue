<template>
  <b-row class="flowcell">
    <b-col>
      <div class="position">{{ position }}</div>

      <b-form-input :value="libraryBarcode" @change="setBarcode" :id='"libraryBarcode-"+this.index' placeholder="Library barcode" type="text" />
    </b-col>
  </b-row>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions , mapMutations} = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'SaphyrFlowcell',
  props: {
    position: {
      type: [Number]
    },
    index: {
      type: [Number]
    }
  },
  methods: {
    async setBarcode(barcode) {
      let isValid = await this.isLibraryBarcodeValid(barcode)
      
      if (isValid) {
        let libraryTube = await this.getTubeForBarcode(barcode)
        let container_material = libraryTube.materials[0]
        let payload = { library: { id: container_material.material_id, barcode: container_material.barcode }, flowcellIndex: this.index }

        this.setLibraryBarcode(payload)
      } else {
        this.alert('Library is not valid', 'danger')
      }
    },
    ...mapActions([
      'isLibraryBarcodeValid',
      'getTubeForBarcode',
    ]),
    ...mapMutations([
      'setLibraryBarcode',
    ]),
    alert (message, type) {
      this.$emit('alert', message, type)
    },
  },
  computed: {
    ...mapState({
      libraryBarcode (state) {
        return state.currentRun.chip.flowcells[this.index].library.barcode
      }
    })
  }
}
</script>
