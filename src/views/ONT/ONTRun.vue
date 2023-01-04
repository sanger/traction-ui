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
    numFlowCellRows() {
      // TODO: fetch this from instrument in run
      return 2
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
    ...mapActions(['newRun', 'createRun']),
    provider() {
      this.newRun()
    },
    async runAction() {
      // WHY multiple responses?
      let responses = await this[this.currentAction.method]()

      // Check what this responses will be, an object or list?
      if (responses.length == 0) {
        this.redirectToRuns()
      } else {
        this.showAlert(
          'Failed to create run in Traction: ' + responses,
          'danger',
          'run-validation-message',
        )
      }
    },
  },
}
</script>

<style scoped></style>
