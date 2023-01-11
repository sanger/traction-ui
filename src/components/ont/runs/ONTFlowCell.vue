<template>
  <div>
    <div class="rounded overflow-hidden shadow-lg" :class="flowcell_bg_colour">
      <div class="px-2 py-2">
        <div class="text-xl mb-2">Position: {{ position }}</div>
        <traction-form-group
          id="input-group-flowcell-id"
          label="Flowcell"
          label-for="flowcell-id"
          label-align="left"
          label-cols="auto"
        >
          <traction-input
            :id="'flowcell-id-' + position"
            type="string"
            size="sm"
            placeholder="Scan flowcell ID"
            :value="flowcellId"
            @input="setFlowcellId({ $event, position })"
          ></traction-input>
        </traction-form-group>
        <traction-form-group
          id="input-group-pool-id"
          label="Pool Id  "
          label-for="pool-id"
          label-align="left"
          label-cols="auto"
        >
          <traction-input
            :id="'pool-id-' + position"
            type="string"
            placeholder="Scan pool ID"
            :value="poolId"
            @input="setPoolId({ $event, position })"
          ></traction-input>
        </traction-form-group>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * # ONTFlowCell
 *
 * Displays a panel for an individualflow cell. May be empty or contain a pool.
 */
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('traction/ont/runs')

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
      // Only needed for debugging
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
      poolId(state) {
        let flowcell = state.currentRun.flowcell_attributes.find(
          (flowcell) => flowcell.position == this.position,
        )
        if (flowcell) {
          return flowcell.pool_id
        }
      },
      flowcell_bg_colour() {
        var counter = 0
        if (this.flowcellId) {
          counter++
        }
        if (this.poolId) {
          counter++
        }
        if (counter == 2) {
          return 'fc_ready'
        }
        if (counter == 1) {
          return 'fc_partial'
        }
        return 'fc_empty'
      },
    }),
  },
  methods: {
    ...mapMutations(['setFlowcellId', 'setPoolId']),
  },
}
</script>

<style scoped lang="scss">
.fc_empty {
  background-color: rgb(230, 230, 230);
}
.fc_partial {
  background-color: rgb(243, 243, 82);
}
.fc_ready {
  background-color: rgb(77, 199, 77);
}
</style>
