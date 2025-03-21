<template>
  <DataFetcher :fetcher="provider">
    <div class="flex flex-row justify-end mt-2">
      <router-link :to="{ name: 'ONTRunIndex' }">
        <traction-button id="backToRunsButton" class="float-right">Back</traction-button>
      </router-link>
      <traction-button
        v-if="newRecord"
        id="resetButton"
        type="reset"
        theme="default"
        class="float-right"
        @click="newRun"
        >Reset</traction-button
      >

      <traction-button
        :id="currentAction.id"
        class="float-right"
        :theme="currentAction.theme"
        :disabled="!runValid"
        @click="runAction"
        >{{ currentAction.label }}</traction-button
      >
    </div>
    <ONTRunInformation></ONTRunInformation>
    <ONTRunInstrumentFlowcells></ONTRunInstrumentFlowcells>
  </DataFetcher>
</template>
<script>
import DataFetcher from '@/components/DataFetcher.vue'
import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells'
import { mapState, mapActions as mapActionsPinia } from 'pinia'
import { mapActions } from 'vuex'
import { useOntRunsStore } from '@/stores/ontRuns'
import useOntRootStore from '@/stores/ontRoot'

export default {
  name: 'ONTRun',
  components: {
    ONTRunInformation,
    ONTRunInstrumentFlowcells,
    DataFetcher,
  },
  props: {
    id: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      newRecord: isNaN(this.id),
      actions: {
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
      },
    }
  },
  computed: {
    ...mapState(useOntRunsStore, ['currentRun']),
    ...mapState(useOntRootStore, ['instruments']),
    currentAction() {
      return this.actions[this.newRecord ? 'create' : 'update']
    },
    runValid() {
      const flowCellsValid = this.currentRun.flowcell_attributes?.every((fc) => {
        // If it has a tube barcode or flowcell id, it must have both and no errors
        return (
          (!!fc.tube_barcode && !!fc.flowcell_id && Object.values(fc.errors).length == 0) ||
          (!fc.tube_barcode && !fc.flowcell_id)
        )
      })
      return this.currentRun.instrument_name && this.currentRun.state && flowCellsValid && this.currentRun.rebasecalling_process
    },
  },
  methods: {
    ...mapActionsPinia(useOntRunsStore, ['createRun', 'fetchRun', 'newRun', 'updateRun']),
    ...mapActionsPinia(useOntRootStore, ['setInstruments']),
    ...mapActions('traction/ont/pools', ['fetchOntPools']),
    async runAction() {
      const response = await this[this.currentAction.method]()
      if (response.success) {
        this.redirectToRuns()
      } else {
        const action = this.newRecord ? 'create' : 'update'
        this.showAlert(
          `Failed to ${action} run in Traction: ${response.errors}`,
          'danger',
          'run-validation-message',
        )
      }
    },
    redirectToRuns() {
      this.$router.push({ name: 'ONTRunIndex' })
    },
    async provider() {
      await this.setInstruments()

      if (this.id === 'new') {
        this.newRun()
      } else if (!this.newRecord) {
        await this.fetchRun(parseInt(this.id))
      }
      return { success: true }
    },
  },
}
</script>
