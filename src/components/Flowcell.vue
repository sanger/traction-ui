<template>
  <b-row class="flowcell">
    <b-col>
      <b-form-input id="barcode" :value="libraryBarcode" @input="updateLibrary" placeholder="Library barcode" type="text" />
    </b-col>
  </b-row>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapMutations, mapState } = createNamespacedHelpers('traction/saphyr')

export default {
  name: 'Flowcell',
  props: {
    index: {},
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    updateLibrary (e) {
      let payload = { index: this.index, libraryBarcode: e }
      this.updateLibraryBarcode(payload)
    },
    alert (message) {
      this.$emit('alert', message)
    },
    ...mapMutations([
      'updateLibraryBarcode',
    ]),
  },
  computed: {
    ...mapState({
      libraryBarcode (state) {
        return state.currentRun.chip.flowcells[this.index].library.barcode
      }
    }),
  },
  components: {
  }
}
</script>
