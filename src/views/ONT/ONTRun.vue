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
        <div class="flex flex-col w-1/2">
          <ONTAddPools></ONTAddPools>
        </div>
        <div class="flex flex-col w-1/2">
          <ONTRunFlowcell></ONTRunFlowcell>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import ONTAddPools from '@/components/ont/runs/ONTAddPools'
import ONTRunFlowcell from '@/components/ont/runs/ONTRunFlowcell'

export default {
  name: 'ONTRun',
  components: {
    ONTRunInformation,
    ONTAddPools,
    ONTRunFlowcell,
  },
  data() {
    return {}
  },
  created() {
    if (this.$route.params.id !== 'new') {

    }
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
