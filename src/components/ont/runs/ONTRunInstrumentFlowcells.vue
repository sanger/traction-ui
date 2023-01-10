<template>
  <div>
    <traction-section number="3" title="Run Instrument Flowcells">
      <div v-if="getInstrumentLayout">
        <div v-for="rowIndex in numOfRows" :key="rowIndex" class="flex flex-row px-2 py-2">
          <ONTFlowCell
            v-for="colIndex in numOfColumns"
            :key="colIndex"
            :position="calculatePosition(rowIndex, colIndex)"
            class="flex flex-col px-2 py-2"
          >
          </ONTFlowCell>
        </div>
      </div>
    </traction-section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/ont/runs')

import ONTFlowCell from '@/components/ont/runs/ONTFlowCell'
/**
 * # ONTRunInstrumentFlowcells
 *
 * Displays a visual representation of the selected instrument and it's flowcells.
 * Pool panels can be dragged into the flowcells to link them.
 */
export default {
  name: 'ONTRunInstrumentFlowcells',
  components: {
    ONTFlowCell,
  },
  props: {},
  computed: {
    ...mapGetters(['currentRun', 'instrumentFlowcellLayout']),
    getInstrumentLayout() {
      return this.instrumentFlowcellLayout[this.currentRun.instrument_name]
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
