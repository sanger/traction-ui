<template>
  <div id="ontrun">
    <router-link :to="{ name: 'ONTRuns' }">
      <traction-button id="backToRunsButton" class="float-right">Back</traction-button>
    </router-link>

    <traction-button
      :id="currentAction.id"
      class="float-right"
      :theme="currentAction.theme"
      :disabled="!runValid"
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

import { createNamespacedHelpers, mapActions } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/ont/runs')

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
    ...mapGetters(['currentRun']),
    currentAction() {
      return this.actions[this.newRecord ? 'create' : 'update']
    },
    runValid() {
      return this.currentRun.instrument_name && this.currentRun.state
    },
  },
  created() {
    this.provider()
  },
  methods: {
    ...mapActions('traction/ont/runs', [
      'createRun',
      'setInstruments',
      'editRun',
      'newRun',
      'updateRun',
    ]),
    ...mapActions('traction/ont', ['fetchOntPools']),
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
      await this.fetchOntPools()

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
