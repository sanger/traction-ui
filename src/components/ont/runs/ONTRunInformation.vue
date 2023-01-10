<template>
  <div class="tag-set-list">
    <traction-section number="1" title="Run Information">
      <div class="flex flex-row">
        <div class="flex flex-col w-1/2">
          <traction-field-group label="Instrument" label-for="instrument-selection">
            <traction-select
              id="instrument-selection"
              :options="instrumentOptions"
              :value="instrumentName"
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
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('traction/ont/runs')

/**
 * # ONTRunInformation
 *
 * Displays an information panel allowing the user to select a choice of instrument and/or state for the run.
 */
export default {
  name: 'ONTRunInformation',
  data() {
    return {
      statesList: ['pending', 'started', 'completed', 'cancelled'],
      instrumentTypes: [
        'MinIon', // 1 flowcell
        'GridIon', // 5 flowcells
        'PromethIon', // 24 flowcells
      ],
    }
  },
  computed: {
    ...mapGetters(['currentRun']),
    ...mapState({
      instrumentName: (state) => state.currentRun.instrument_name,
      state: (state) => state.currentRun.state,
    }),
    instrumentOptions() {
      let options = this.instrumentTypes.map((name) => ({
        value: name,
        text: name,
      }))

      return [{ value: null, text: 'Please select an instrument', disabled: true }, ...options]
    },
    stateOptions() {
      let options = this.statesList.map((state) => ({
        value: state,
        text: this.capitalise(state),
      }))

      return [{ value: null, text: 'Please select a state', disabled: true }, ...options]
    },
  },
  methods: {
    capitalise(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    ...mapMutations(['setInstrumentName', 'setState']),
  },
}
</script>
