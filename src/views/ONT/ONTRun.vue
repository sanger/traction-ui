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

export default {
  name: 'ONTRun',
  components: {
    ONTRunInformation,
    ONTAddPools,
    ONTRunInstrumentFlowcells,
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
    if (this.$route.params.id !== 'new') {}
  },
  methods: {
    alertOnFail({ success, errors }) {
      if (!success) {
        this.showAlert(errors, 'danger')
      }
    },
  },
}
</script>

<style scoped></style>
