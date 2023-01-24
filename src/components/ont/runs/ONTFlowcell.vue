<template>
  <div>
    <div class="rounded overflow-hidden shadow-lg" :class="flowcell_bg_colour">
      <div class="px-2 py-2">
        <div class="text-xl mb-2">{{ coordinate }}</div>
        <traction-form-group
          id="input-group-flowcell-id"
          label="Flowcell"
          label-for="flowcell-id"
          label-align="left"
          label-cols="auto"
        >
          <traction-input
            :id="'flowcell-id-' + position"
            size="sm"
            placeholder="Scan flowcell ID"
            :value="flowcellId"
            :formatter="formatter"
            :state="flowcellIdValidation"
            @input="setFlowcellId({ $event, position })"
          ></traction-input>
          <!-- This will only be shown if the preceding input has an invalid state -->
          <traction-invalid-feedback id="input-live-feedback"
            >Enter at valid Flowcell ID (3 letters then atleast 3
            numbers)</traction-invalid-feedback
          >
        </traction-form-group>
        <traction-form-group
          id="input-group-pool-id"
          label="Library Barcode"
          label-for="pool-id"
          label-align="left"
          label-cols="auto"
        >
          <traction-input
            :id="'pool-id-' + position"
            placeholder="Scan library barcode"
            :value="poolTubeBarcode"
            :formatter="formatter"
            @input="setPoolTubeBarcode({ $event, position })"
          ></traction-input>
        </traction-form-group>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * # ONTFlowcell
 *
 * Displays a panel for an individualflow cell. May be empty or contain a pool.
 */
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('traction/ont/runs')

export default {
  name: 'ONTFlowcell',
  props: {
    position: {
      type: Number,
      required: true,
    },
    coordinate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    flowcellIdValidation() {
      if (this.flowcellId) {
        // 3 letters followed by at least 3 numbers
        return !!this.flowcellId.match(/^[a-zA-Z]{3}\d{3,}$/)
      } else {
        return null
      }
    },
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
      poolTubeBarcode(state) {
        let flowcell = state.currentRun.flowcell_attributes.find(
          (flowcell) => flowcell.position == this.position,
        )
        if (flowcell) {
          return flowcell.tube_barcode
        }
      },
      flowcell_bg_colour() {
        var counter = 0
        if (this.flowcellId) {
          counter++
        }
        if (this.poolTubeBarcode) {
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
    ...mapMutations(['setFlowcellId', 'setPoolTubeBarcode']),
    formatter(value) {
      return value.toUpperCase().trim()
    },
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
