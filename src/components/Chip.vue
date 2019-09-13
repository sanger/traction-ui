<template>
  <b-container class="chip">

    <b-form-input :value="chipBarcode" @change="updateBarcode" id="barcode" placeholder="Chip barcode" type="text"/>
    <flowcell v-for="(flowcell, index) in flowcells" v-bind="flowcell" v-bind:key="index" v-bind:index="index" @alert="alert"></flowcell>

  </b-container>
</template>

<script>

import Flowcell from '@/components/Flowcell'
import Helper from '@/mixins/Helper'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions } = createNamespacedHelpers('traction/saphyr/runs')

export default {
  name: 'Chip',
  mixins: [Helper],
  methods: {
    async updateBarcode(barcode) {
      let response = await this.updateChipBarcode(barcode)

      if (response.successful) {
        this.alert('Chip updated', 'success')
      } else {
        this.alert('There was an error: ' + response.errors.message, 'danger')
      }
    },
    ...mapActions([
      'updateChipBarcode',
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
