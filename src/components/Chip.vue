<template>
  <b-container class="chip">

    <b-form-input id="barcode" :value="barcode" @input="updateBarcode" placeholder="Chip barcode" type="text" />

    <flowcell v-for="(flowcell, index) in flowcells" v-bind:key="index" v-bind:index="index" @alert="alert"></flowcell>

  </b-container>
</template>

<script>

import Flowcell from '@/components/Flowcell'
import Api from '@/mixins/Api'
import handlePromise from '@/api/PromiseHelper'
import * as Run from '@/api/Run'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapMutations, mapState } = createNamespacedHelpers('traction/saphyr')

export default {
  name: 'Chip',
  mixins: [Api],
  props: {
    runId: {
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    alert (message) {
      this.$emit('alert', message)
    },
    ...mapMutations([
      'updateBarcode',
    ]),
  },
  computed: {
    existingRecord () {
      return !isNaN(this.runId)
    },
    ...mapState({
      barcode: state => state.currentRun.chip.barcode,
      flowcells: state => state.currentRun.chip.flowcells,
    }),
  },
  components: {
    Flowcell
  }
}
</script>
