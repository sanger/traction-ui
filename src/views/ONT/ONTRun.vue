<template>
  <div id="ontrun">
    <router-link :to="{ name: 'ONTRuns' }">
      <traction-button id="backToRunsButton" class="float-right">Back</traction-button>
    </router-link>
    <div>
      <div class="flex flex-row">
        <div class="flex flex-col w-1/2">
          <ONTRunInformation></ONTRunInformation>
        </div>
      </div>
      <div class="flex flex-row">
        <div class="flex flex-col">
          <ONTAddPools></ONTAddPools>
        </div>
        <div class="flex flex-col w-1/2">
          <ONTRunInstrumentFlowcells
            :flowcell-num-rows="numFlowCellRows"
            :flowcell-num-columns="numFlowCellColumns"
          ></ONTRunInstrumentFlowcells>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import ONTAddPools from '@/components/ont/runs/ONTAddPools'
import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('traction/ont/runs')

export default {
  name: 'ONTRun',
  components: {
    ONTRunInformation,
    ONTAddPools,
    ONTRunInstrumentFlowcells,
  },
  props: {
    id: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {}
  },
  computed: {
    numFlowCellRows() {
      // TODO: fetch this from instrument in run
      return 8
    },
    numFlowCellColumns() {
      // TODO: fetch this from instrument in run
      return 3
    },
  },
  created() {
    this.provider()
  },
  methods: {
    ...mapActions(['newRun']),
    provider() {
      this.newRun()
    },
  },
}
</script>

<style scoped></style>
