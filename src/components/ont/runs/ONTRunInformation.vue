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
        <label label-for="rebasecalling-selection"> Rebasecalling Process </label>
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

<script setup>
import { computed } from 'vue'
import { useOntRunsStore } from '@/stores/ontRuns'
import useOntRootStore from '@/stores/ontRoot'

// Initialize stores
const ontRunsStore = useOntRunsStore()
const ontRootStore = useOntRootStore()

const { setInstrumentName, setState, setRebasecallingProcess } = ontRunsStore
const { instruments } = ontRootStore

// Static lists
const statesList = ['Pending', 'Completed', 'User Terminated', 'Instrument Crashed', 'Restart']
const rebasecallingList = ['5mC + 5hmC CpG-context', '5mC + 5hmC all-context', '6mA all-context']

// Computed properties
const instrumentName = computed(() => ontRunsStore.currentRun.instrument_name)
const state = computed(() => ontRunsStore.currentRun.state)
const rebasecallingProcess = computed(() => ontRunsStore.currentRun.rebasecalling_process)

const instrumentOptions = computed(() => [
  { value: null, text: 'Please select an instrument', disabled: true },
  ...instruments.map((instrument) => ({
    value: instrument.name,
    text: instrument.name,
  })),
])

const stateOptions = computed(() => [
  { value: null, text: 'Please select a state', disabled: true },
  ...statesList.map((state) => ({
    value: formatState(state),
    text: state,
  })),
])

const rebasecallingOptions = computed(() => [
  { value: null, text: 'Please select a rebasecalling process', disabled: true },
  ...rebasecallingList.map((rebasecalling) => ({
    value: rebasecalling,
    text: rebasecalling,
  })),
])

const newRecord = computed(() => isNaN(ontRunsStore.currentRun.id))

// Helper function to format state values
const formatState = (str) => str.replace(/\s+/g, '_').toLowerCase()
</script>
