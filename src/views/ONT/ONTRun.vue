<template>
  <div id="pool">
    <div class="flex flex-row">
      <ONTRunInformation></ONTRunInformation>
    </div>
    <div class="flex flex-row">
      <div class="flex flex-col w-1/2 px-4">
        <ONTAddPools></ONTAddPools>
      </div>
      <div class="flex flex-col w-1/2 mt-6 gap-y-4">
        <ONTRunFlowcell></ONTRunFlowcell>
      </div>
    </div>
  </div>
</template>

<script>
import ONTRunInformation from '@/components/ont/ONTRunInformation'
import ONTAddPools from '@/components/ont/ONTAddPools'
import ONTRunFlowcell from '@/components/ont/ONTRunFlowcell'

export default {
  name: 'ONTRun',
  components: {
    ONTRunInformation,
    ONTAddPools,
    ONTRunFlowcell
  },
  data() {
    return { }
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
