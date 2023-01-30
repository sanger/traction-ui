<template>
  <div>
    <div
      style="width: 200px"
      class="px-2 rounded overflow-hidden shadow-lg"
      :class="flowcell_bg_colour"
    >
      <div class="text-xl mb-2">{{ coordinate }}</div>
      <traction-form-group
        id="input-group-flowcell-id"
        label="Flowcell ID:"
        label-for="flowcell-id"
        label-align="left"
      >
        <BFormInput
          :id="'flowcell-id-' + position"
          placeholder="Scan flowcell ID"
          :value="flowcellId"
          :formatter="formatter"
          :state="flowcellIdValidation"
          @input="setFlowcellId({ $event, position })"
        ></BFormInput>
        <!-- This will only be shown if the preceding input has an invalid state -->
        <traction-invalid-feedback id="input-flowcell-id-feedback"
          >Enter at valid Flowcell ID (3 letters then at least 3 numbers)</traction-invalid-feedback
        >
      </traction-form-group>
      <traction-form-group
        id="input-group-pool-id"
        label="Pool Library Barcode:"
        label-for="pool-id"
        label-align="left"
      >
        <BFormInput
          :id="'pool-id-' + position"
          v-model="barcode"
          :formatter="formatter"
          :state="barcodeState"
          debounce="500"
          placeholder="Scan library barcode"
        ></BFormInput>
        <traction-invalid-feedback id="input-pool-tube-barcode-feedback"
          >Enter a valid Pool Library barcode</traction-invalid-feedback
        >
      </traction-form-group>
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
const { mapActions } = createNamespacedHelpers('traction/ont/pools')
import { BFormInput } from 'bootstrap-vue'

export default {
  name: 'ONTFlowcell',
  components: {
    BFormInput,
  },
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
    return {
      barcodeState: null,
    }
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
    // For Vuex asynchronous validation we need to use computer setter and getter properties
    barcode: {
      get() {
        if (this.poolTubeBarcode) {
          this.setBarcodeState(true)
        }
        return this.poolTubeBarcode
      },
      async set(value) {
        let response = await this.validatePoolBarcode(value)
        if (response.success) {
          this.setPoolTubeBarcode({ barcode: value, position: this.position })
        }
        this.setBarcodeState(response.success)
      },
    },
    ...mapState({
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
        if (this.flowcellIdValidation == false || this.barcodeState == false) {
          return 'border border-3 border-danger'
        }

        if (this.flowcellIdValidation && this.barcodeState) {
          return 'border border-3 border-success'
        }

        if (this.flowcellIdValidation || this.barcodeState) {
          return 'border border-3 border-warning'
        }

        return 'border border-3 border-white'
      },
    }),
  },
  methods: {
    ...mapMutations(['setFlowcellId', 'setPoolTubeBarcode']),
    ...mapActions(['validatePoolBarcode']),
    formatter(value) {
      return value.toUpperCase().trim()
    },
    setBarcodeState(state) {
      this.barcodeState = state
    },
  },
}
</script>
