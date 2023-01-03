<template>
  <div>
    <traction-section number="3" title="Run Instrument Flowcells">
      <div
        v-for="rowIndex in Number(flowcellNumRows)"
        :key="rowIndex"
        class="flex flex-row px-2 py-2"
      >
        <ONTFlowCell
          v-for="colIndex in Number(flowcellNumColumns)"
          :key="colIndex"
          flowcell-id="flowcell id"
          :flowcell-row="rowIndex"
          :flowcell-col="colIndex"
          pool-barcode="Pool123456"
          class="flex flex-col px-2 py-2"
        >
        </ONTFlowCell>
      </div>
    </traction-section>
  </div>
</template>

<script>
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
  props: {
    flowcellNumRows: {
      type: Number,
      default: 0,
    },
    flowcellNumColumns: {
      type: Number,
      default: 0,
    },
  },
  computed: {},
  methods: {},
}
</script>
