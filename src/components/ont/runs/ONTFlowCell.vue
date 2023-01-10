<template>
  <div>
    Position: {{ position }} flowcell: {{ flowcell }}
    <div class="rounded overflow-hidden shadow-lg bg-green-500">
      <div class="px-6 py-4">
        <div class="font-bold text-l mb-2">No pool</div>
      </div>
    </div>
    <traction-input
      :id="'flowcell-id-' + position"
      type="string"
      placeholder="Scan flowcell ID"
      :value="flowcellId"
      @input="setFlowcellId({ $event, position })"
    ></traction-input>
  </div>
</template>
<script>
/**
 * # ONTFlowCell
 *
 * Displays a panel for an individualflow cell. May be empty or contain a pool.
 */
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('traction/ont/runs')

export default {
  name: 'ONTFlowCell',
  props: {
    position: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      flowcell(state) {
        return state.currentRun.flowcell_attributes.find(
          (flowcell) => flowcell.position == this.position,
        )
      },
      flowcellId(state) {
        let flowcell = state.currentRun.flowcell_attributes.find(
          (flowcell) => flowcell.position == this.position,
        )
        if (flowcell) {
          return flowcell.flowcell_id
        }
      },
    }),
  },
  methods: {
    ...mapMutations(['setFlowcellId']),
  },
}
</script>
