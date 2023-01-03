<template>
  <div class="tag-set-list">
    Test : {{ instrument }}
    <traction-section number="1" title="Run Information">
      <div class="flex flex-row">
        <div class="flex flex-col w-1/2">
          <traction-field-group label="Instrument" label-for="instrument-selection">
            <traction-select
              id="instrument-selection"
              v-model="instrument"
              :options="instrumentOptions"
            ></traction-select>
          </traction-field-group>
        </div>
        <div class="flex flex-col w-1/2">
          <traction-field-group label="State" label-for="state-selection">
            <traction-select
              id="state-selection"
              v-model="state"
              :options="stateOptions"
            ></traction-select>
          </traction-field-group>
        </div>
      </div>
    </traction-section>
  </div>
</template>

<script>
/**
 * # ONTRunInformation
 *
 * Displays an information panel allowing the user to select a choice of instrument and/or state for the run.
 */
export default {
  name: 'ONTRunInformation',
  data() {
    return {
      state: null,
      instrument: null,
      instrumentsList: [
        { value: 'instrument_1', text: 'Instrument 1' },
        { value: 'instrument_2', text: 'Instrument 2' },
      ],
      statesList: [
        { value: 'pending', text: 'Pending' },
        { value: 'started', text: 'Started' },
        { value: 'completed', text: 'Completed' },
        { value: 'cancelled', text: 'Cancelled' },
      ],
    }
  },
  computed: {
    instrumentOptions() {
      return [
        { value: null, text: 'Please select an instrument', disabled: true },
        ...this.instrumentsList,
      ]
    },
    stateOptions() {
      return [{ value: null, text: 'Please select a state' }, ...this.statesList]
    },
  },
  methods: {},
}
</script>
