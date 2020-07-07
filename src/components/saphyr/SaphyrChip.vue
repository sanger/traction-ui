<template>
  <b-container class="chip">

    <b-form-input :value="chip.barcode" @change="setBarcode" id="barcode" placeholder="Chip barcode" type="text"/>
    <flowcell v-for="(flowcell, index) in chip.flowcells" v-bind="flowcell" v-bind:key="index" v-bind:index="index" @alert="alert"></flowcell>

  </b-container>
</template>

<script>

import Flowcell from '@/components/saphyr/SaphyrFlowcell'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'SaphyrChip',
  props: {
    chip: {
      type: Object,
      required: true
    }
  },
  methods: {
    async setBarcode(barcode) {
      let isValid = this.isChipBarcodeValid(barcode)

      if (isValid) {
        this.alert('Chip barcode is valid', 'success')
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
      'setChipBarcode'
    ]),
    alert (message, type) {
      this.$emit('alert', message, type)
    },
  },
  components: {
    Flowcell
  }
}
</script>
