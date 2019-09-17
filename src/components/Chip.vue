<template>
  <b-container class="chip">

    <b-form-input :value="chipBarcode" @change="setBarcode" id="barcode" placeholder="Chip barcode" type="text"/>
    <flowcell v-for="(flowcell, index) in flowcells" v-bind="flowcell" v-bind:key="index" v-bind:index="index" @alert="alert"></flowcell>

  </b-container>
</template>

<script>

import Flowcell from '@/components/Flowcell'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions, mapMutations } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'Chip',
  methods: {
    async setBarcode(barcode) {
      let isValid = this.isChipBarcodeValid(barcode)

      if (isValid) {
        this.setChipBarcode(barcode)
      } else {
        this.alert('Chip barcode is not valid', 'danger')
      }
    },
    isChipBarcodeValid(barcode) {
      if (barcode.length < 16) { return false }
      return true
    },
    ...mapMutations([
      'setChipBarcode',
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
      chipBarcode: state => state.currentRun.chip.barcode,
      flowcells: state => state.currentRun.chip.flowcells,
    })
  },
  components: {
    Flowcell
  }
}
</script>
