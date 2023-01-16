<template>
  <div>
    <traction-section number="2" title="Run Instrument Flowcells">
      <div v-if="getInstrumentLayout">
        <div v-for="rowIndex in numOfRows" :key="rowIndex" class="flex flex-row px-2 py-2">
          <ONTFlowcell
            v-for="colIndex in numOfColumns"
            :key="colIndex"
            :position="calculatePosition(rowIndex, colIndex)"
            class="flex flex-col px-2 py-2"
          ></ONTFlowcell>
        </div>
      </div>
      <div v-else>Please select an Instrument</div>
    </traction-section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/ont/runs')

import ONTFlowcell from '@/components/ont/runs/ONTFlowcell'
/**
 * # ONTRunInstrumentFlowcells
 *
 * Displays a visual representation of the selected instrument and it's flowcells.
 * Pool panels can be dragged into the flowcells to link them.
 */
export default {
  name: 'ONTRunInstrumentFlowcells',
  components: {
    ONTFlowcell,
  },
  props: {},
  computed: {
    ...mapGetters(['currentRun', 'instrumentFlowcellLayout', 'instruments']),
    getInstrumentLayout() {
      let instrumenConfig = this.instruments.find(
        (instrument) => instrument.name == this.currentRun.instrument_name,
      )
      if (instrumenConfig) {
        return this.instrumentFlowcellLayout[instrumenConfig.instrument_type]
      }
    },
    numOfRows() {
      return this.getInstrumentLayout['rows']
    },
    numOfColumns() {
      return this.getInstrumentLayout['columns']
    },
  },
  methods: {
    calculatePosition(rowIndex, colIndex) {
      return this.numOfRows * (colIndex - 1) + rowIndex
    },
  },
}
</script>
