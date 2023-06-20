<template>
  <DataFetcher :fetcher="provider">
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

    <ONTRunInformation></ONTRunInformation>
    <ONTRunInstrumentFlowcells></ONTRunInstrumentFlowcells>
  </DataFetcher>
</template>
<script>
import DataFetcher from '@/components/DataFetcher.vue'
import ONTRunInformation from '@/components/ont/runs/ONTRunInformation'
import ONTRunInstrumentFlowcells from '@/components/ont/runs/ONTRunInstrumentFlowcells'
import { mapActions, mapGetters } from 'vuex'

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
    ...mapGetters('traction/ont/runs', ['currentRun']),
    ...mapGetters('traction/ont', ['instruments']),
    currentAction() {
      return this.actions[this.newRecord ? 'create' : 'update']
    },
    runValid() {
      const flowcells = (this.currentRun.flowcell_attributes || []).filter(
        (fc) => fc.flowcell_id && fc.tube_barcode,
      )
      return this.currentRun.instrument_name && this.currentRun.state && flowcells.length != 0
    },
  },
  methods: {
    ...mapActions('traction/ont/runs', ['createRun', 'fetchRun', 'newRun', 'updateRun']),
    ...mapActions('traction/ont', ['setInstruments']),
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
      await this.fetchOntPools()

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

<style scoped></style>
