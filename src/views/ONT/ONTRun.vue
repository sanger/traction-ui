<template>
  <div id="ontrun">
    <router-link :to="{ name: 'ONTRuns' }">
      <traction-button id="backToRunsButton" class="float-right">Back</traction-button>
    </router-link>

    <traction-button
      :id="currentAction.id"
      class="float-right"
      :theme="currentAction.theme"
      @click="runAction"
      >{{ currentAction.label }}</traction-button
    >

    <ONTRunInformation></ONTRunInformation>
    <ONTRunInstrumentFlowcells></ONTRunInstrumentFlowcells>
  </div>
</template>
<script>
import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('traction/ont/runs')

export default {
  name: 'ONTRun',
  components: {
    ONTRunInformation,
    ONTRunInstrumentFlowcells,
  },
  props: {
    id: {
      type: [String, Number],
      default: 0,
    },
    actions: {
      type: Object,
      default() {
        return {
          create: {
            id: 'create',
            theme: 'create',
            label: 'Create',
            method: 'createRun',
          },
          update: {
            id: 'update',
            theme: 'update',
            label: 'Update',
            method: 'updateRun',
          },
        }
      },
    },
  },
  data() {
    return {
      newRecord: isNaN(this.id),
    }
  },
  computed: {
    currentAction() {
      return this.actions[this.newRecord ? 'create' : 'update']
    },
  },
  created() {
    this.provider()
  },
  methods: {
    ...mapActions(['createRun', 'setInstruments', 'editRun', 'newRun']),
    async runAction() {
      let response = await this[this.currentAction.method]()

      if (response.success) {
        this.redirectToRuns()
      } else {
        this.showAlert(
          'Failed to create run in Traction: ' + response.errors,
          'danger',
          'run-validation-message',
        )
      }
    },
    redirectToRuns() {
      this.$router.push({ name: 'ONTRuns' })
    },
    async provider() {
      if (this.id === 'new') {
        this.newRun()
      } else if (!this.newRecord) {
        await this.setInstruments()
        await this.editRun(parseInt(this.id))
      }
    },
  },
}
</script>

<style scoped></style>
