<template>
  <b-row class="flowcell">
    <b-col>
      <div class="position">{{ position }}</div>

      <b-form-input :value="libraryBarcode" @change="updateBarcode" id="libraryBarcode" placeholder="Library barcode" type="text" />
    </b-col>
  </b-row>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'Flowcell',
  props: {
    position: {
      type: [Number]
    },
    index: {
      type: [Number]
    }
  },
  methods: {
    async updateBarcode(barcode) {
      if (!barcode) {
        this.alert('Please enter a barcode', 'danger')
        return
      }

      let payload = { barcode: barcode, flowcellIndex: this.index}
      let response = await this.updateLibraryBarcode(payload)

      if (response.successful) {
        this.alert('Library updated', 'success')
      } else {
        this.alert('There was an error: ' + response.errors.message, 'danger')
      }
    },
    ...mapActions([
      'updateLibraryBarcode',
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
