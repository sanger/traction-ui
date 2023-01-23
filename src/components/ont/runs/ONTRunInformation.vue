<template>
  <traction-section number="1" title="Run Information">
    <div class="flex flex-row">
      <div class="flex flex-col w-1/2">
        <traction-field-group label="Instrument" label-for="instrument-selection">
          <traction-select
            id="instrument-selection"
            :options="instrumentOptions"
            :value="instrumentName"
            :disabled="!newRecord"
            @input="setInstrumentName"
          ></traction-select>
        </traction-field-group>
      </div>
      <div class="flex flex-col w-1/2">
        <traction-field-group label="State" label-for="state-selection">
          <traction-select
            id="state-selection"
            :options="stateOptions"
            :value="state"
            @input="setState"
          ></traction-select>
        </traction-field-group>
      </div>
    </div>
  </traction-section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations, mapActions } =
  createNamespacedHelpers('traction/ont/runs')

/**
 * # ONTRunInformation
 *
 * Displays an information panel allowing the user to select a choice of instrument and/or state for the run.
 */
export default {
  name: 'ONTRunInformation',
  data() {
    return {
      statesList: ['Pending', 'Completed', 'User Terminated', 'Instrument Crashed', 'Restart'],
    }
  },
  computed: {
    ...mapGetters(['currentRun', 'instruments']),
    ...mapState({
      instrumentName: (state) => state.currentRun.instrument_name,
      state: (state) => state.currentRun.state,
    }),
    instrumentOptions() {
      let options = this.instruments.map((instrument) => ({
        value: instrument.name,
        text: instrument.name,
      }))

      return [{ value: null, text: 'Please select an instrument', disabled: true }, ...options]
    },
    stateOptions() {
      let options = this.statesList.map((state) => ({
        value: this.formatState(state),
        text: state,
      }))

      return [{ value: null, text: 'Please select a state', disabled: true }, ...options]
    },
    newRecord() {
      return isNaN(this.currentRun.id)
    },
  },
  created() {
    this.provider()
  },
  methods: {
    // use data fetcher instead?
    async provider() {
      try {
        await this.setInstruments()
      } catch (error) {
        this.showAlert('Failed to get instruments: ' + error.message, 'danger')
      }
    },
    formatState(str) {
      return str.replace(/\s+/g, '_').toLowerCase()
    },
    ...mapMutations(['setInstrumentName', 'setState']),
    ...mapActions(['setInstruments']),
  },
}
</script>
