<template>
  <div class="mt-4">
    <traction-section number="2" title="Run Instrument Flowcells">
      <div v-if="instrument">
        <div v-for="rowIndex in instrument.rows" :key="rowIndex" class="flex flex-row px-2 py-2">
          <ONTFlowcell
            v-for="colIndex in instrument.columns"
            :key="colIndex"
            :position="calculatePosition(rowIndex, colIndex)"
            :coordinate="calculateCoordinate(rowIndex, colIndex)"
            class="flex flex-col px-2 py-2"
          ></ONTFlowcell>
        </div>
      </div>
      <div v-else>Please select an Instrument</div>
    </traction-section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ONTFlowcell from '@/components/ont/runs/ONTFlowcell'
/**
 * # ONTRunInstrumentFlowcells
 *
 * Displays a visual representation of the selected instrument and it's flowcells.
 * The user can scan flowcell ids and pool tube barcodes into the flowcells and create (or update) a run.
 */
export default {
  name: 'ONTRunInstrumentFlowcells',
  components: {
    ONTFlowcell,
  },
  props: {},
  computed: {
    ...mapGetters('traction/ont/runs', ['currentRun']),
    ...mapGetters('traction/ont', ['instruments', 'instrumentByName']),
    instrument() {
      return this.instrumentByName(this.currentRun.instrument_name)
    },
  },
  methods: {
    calculatePosition(rowIndex, colIndex) {
      return this.instrument.rows * (colIndex - 1) + rowIndex
    },
    calculateCoordinate(rowIndex, colIndex) {
      const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      return this.instrument.useCoordinates
        ? `${colIndex}${rowLetters[rowIndex - 1]}`
        : `${colIndex}`
    },
  },
}
</script>
