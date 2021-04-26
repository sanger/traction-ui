<template>
  <b-container class="chip">
    <b-form-input
      id="barcode"
      :value="chip.barcode"
      placeholder="Chip barcode"
      type="text"
      @change="setBarcode"
    />
    <flowcell
      v-for="(flowcell, index) in chip.flowcells"
      :key="index"
      v-bind="flowcell"
      :index="index"
      @alert="alert"
    ></flowcell>
  </b-container>
</template>

<script>
import Flowcell from '@/components/saphyr/SaphyrFlowcell'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'SaphyrChip',
  components: {
    Flowcell,
  },
  props: {
    chip: {
      type: Object,
      required: true,
    },
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
      if (barcode.length < 16) {
        return false
      }
      return true
    },
    ...mapMutations(['setChipBarcode']),
    alert(message, type) {
      this.$emit('alert', message, type)
    },
  },
}
</script>
