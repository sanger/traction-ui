<template>
  <traction-section number="1" title="Run Information">
    <div class="flex flex-row mt-2 space-x-4">
      <div class="flex flex-col gap-y-2 items-start">
        <label label-for="instrument-selection"> Instrument </label>
        <traction-select
          id="instrument-selection"
          :options="instrumentOptions"
          :model-value="instrumentName"
          :disabled="!newRecord"
          @update:model-value="setInstrumentName"
        ></traction-select>
      </div>
      <div class="flex flex-col gap-y-2 items-start">
        <label label-for="state-selection"> State </label>
        <traction-select
          id="state-selection"
          :options="stateOptions"
          :model-value="state"
          @update:model-value="setState"
        ></traction-select>
      </div>
      <div class="flex flex-col gap-y-2 items-start">
        <label label-for="rebasecalling-selection"> Rebasecalling process </label>
        <traction-select
          id="rebasecalling-selection"
          :options="rebasecallingOptions"
          :model-value="rebasecallingProcess"
          @update:model-value="setRebasecallingProcess"
        ></traction-select>
      </div>
    </div>
  </traction-section>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useOntRunsStore } from '@/stores/ontRuns'
import useOntRootStore from '@/stores/ontRoot'

/**
 * # ONTRunInformation
 *
 * Displays an information panel allowing the user to select an instrument and state for the run.
 */
export default {
  name: 'ONTRunInformation',
  data() {
    return {
      statesList: ['Pending', 'Completed', 'User Terminated', 'Instrument Crashed', 'Restart'],
      rebasecallingList: ['5mC + 5hmC CpG-context', '5mC + 5hmC all-context', '6mA all-context'],
    }
  },
  computed: {
    ...mapState(useOntRootStore, ['instruments']),
    ...mapState(useOntRunsStore, ['currentRun']),
    instrumentName() {
      //This is to keep instrumentName in sync with the Pinia store state  (option api way)
      const ontRunsStore = useOntRunsStore()
      return ontRunsStore.currentRun.instrument_name
    },
    state() {
      //This is to keep currentRun.state in sync with the Pinia store state  (option api way)
      const ontRunsStore = useOntRunsStore()
      return ontRunsStore.currentRun.state
    },
    rebasecallingProcess() {
      //This is to keep currentRun.rebasecalling in sync with the Pinia store state  (option api way)
      const ontRunsStore = useOntRunsStore()
      return ontRunsStore.currentRun.rebasecalling_process
    },
    instrumentOptions() {
      const options = this.instruments.map((instrument) => ({
        value: instrument.name,
        text: instrument.name,
      }))

      return [{ value: null, text: 'Please select an instrument', disabled: true }, ...options]
    },
    stateOptions() {
      const options = this.statesList.map((state) => ({
        value: this.formatState(state),
        text: state,
      }))

      return [{ value: null, text: 'Please select a state', disabled: true }, ...options]
    },
    rebasecallingOptions() {
      const options = this.rebasecallingList.map((rebasecalling) => ({
        value: rebasecalling,
        text: rebasecalling,
      }))

      return [
        { value: null, text: 'Please select a rebasecalling process', disabled: true },
        ...options,
      ]
    },
    newRecord() {
      return isNaN(this.currentRun.id)
    },
  },
  methods: {
    formatState(str) {
      return str.replace(/\s+/g, '_').toLowerCase()
    },
    ...mapActions(useOntRunsStore, ['setInstrumentName', 'setState', 'setRebasecallingProcess']),
  },
}
</script>
