<template>
  <div class="tag-set-list">
    <traction-section number="1" title="Run Information"></traction-section>
    <div>
      <div class="flex flex-row">
        <div class="flex flex-col w-1/2">
          <traction-field-group label="Instrument" label-for="instrument-selection">
            <traction-select
              id="instrument-selection"
              :value="instrument"
              :options="instrumentOptions"
              @input="handleInstrumentSelection"
            ></traction-select>
          </traction-field-group>
        </div>
        <div class="flex flex-col w-1/2">
          <traction-field-group label="State" label-for="state-selection">
            <traction-select
              id="state-selection"
              :value="state"
              :options="stateOptions"
              @input="handleStateSelection"
            ></traction-select>
          </traction-field-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * # ONTRunInformation
 *
 * Displays a ...
 */
export default {
  name: 'ONTRunInformation',
  data() {
    return {
      instrumentsList: [{ value: '1', text: 'Instrument 1' }, { value: '2', text: 'Instrument 2' }],
      statesList: [{ value: '1', text: 'Pending' }, { value: '2', text: 'Started' }, { value: '3', text: 'Completed' }, { value: '4', text: 'Cancelled' }],
    }
  },
  computed: {
    instrumentOptions() {
      return [{ value: null, text: 'Please select an instrument' }, ...this.instrumentsList]
    },
    stateOptions() {
      return [{ value: null, text: 'Please select a state' }, ...this.statesList]
    },
  },
  methods: {
    handleInstrumentSelection(input) {
      console.log("TODO: handle selection of instrument ", input)
    },
    handleStateSelection(input) {
      console.log("TODO: handle selection of state ", input)
    },
  },
}
</script>
