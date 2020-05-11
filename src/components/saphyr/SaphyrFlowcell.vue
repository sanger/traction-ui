<template>
  <b-row class="flowcell">
    <b-col>
      <div class="position">{{ position }}</div>

      <b-form-input :value="libraryBarcode" @change="setBarcode" id="libraryBarcode" placeholder="Library barcode" type="text" />
    </b-col>
  </b-row>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions , mapMutations} = createNamespacedHelpers('traction/saphyr/runs')

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
        let library = libraryTube.materials[0]
        let payload = { library: library, flowcellIndex: this.index}

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
    ...mapGetters([
      'currentRun'
    ]),
    ...mapState({
      libraryBarcode (state) {
        return state.currentRun.chip.flowcells[this.index].library.barcode
      }
    })
  }
}
</script>
