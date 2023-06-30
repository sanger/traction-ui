<template>
  <traction-section number="1" title="Run Information">
    <div class="grid grid-cols-2 mt-2">
      <div class="flex flex-col gap-y-2 items-start">
        <label label-for="instrument-selection"> Instrument </label>
        <traction-select
          id="instrument-selection"
          :options="instrumentOptions"
          :value="instrumentName"
          :disabled="!newRecord"
          @input="setInstrumentName"
        ></traction-select>
      </div>
      <div class="flex flex-col gap-y-2 items-start">
        <label label-for="instrument-selection"> State </label>
        <traction-select
          id="state-selection"
          :options="stateOptions"
          :value="state"
          @input="setState"
        ></traction-select>
      </div>
    </div>
  </traction-section>
</template>

<script>
import { createNamespacedHelpers, mapGetters } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('traction/ont/runs')

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
    }
  },
  computed: {
    ...mapGetters('traction/ont', ['instruments']),
    ...mapGetters('traction/ont/runs', ['currentRun']),
    ...mapState({
      instrumentName: (state) => state.currentRun.instrument_name,
      state: (state) => state.currentRun.state,
    }),
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
    newRecord() {
      return isNaN(this.currentRun.id)
    },
  },
  methods: {
    formatState(str) {
      return str.replace(/\s+/g, '_').toLowerCase()
    },
    ...mapMutations(['setInstrumentName', 'setState']),
  },
}
</script>
