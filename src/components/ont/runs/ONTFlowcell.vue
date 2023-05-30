<template>
  <div>
    <div
      style="width: 200px"
      class="px-2 rounded overflow-hidden shadow-lg"
      :class="flowcell_bg_colour"
    >
      <div class="text-xl mb-2">{{ coordinate }}</div>
      <fieldset id="input-group-flowcell-id" class="py-2">
        <label class="flex justify-start">Flowcell ID:</label>
        <traction-field-error
          id="input-flowcell-id-feedback"
          :error="flowcellIdValidationError"
          :with-icon="isFlowIdExists"
        >
          <traction-input
            :id="'flowcell-id-' + position"
            placeholder="Scan flowcell ID"
            :value="flowcellId"
            :formatter="formatter"
            :classes="flowcell_id_field_colour"
            @input="setFlowcellId({ $event, position })"
          />
        </traction-field-error>
      </fieldset>
      <fieldset id="input-group-pool-id" class="py-2">
        <label class="flex justify-start">Pool Library Barcode:</label>
        <traction-field-error
          id="input-pool-tube-barcode-feedback"
          :error="barcodeValidationError"
          :with-icon="isBarcodeExists"
        >
          <traction-input
            :id="'pool-id-' + position"
            v-model="barcode"
            :formatter="formatter"
            :classes="flowcell_barcode_field_colour"
            debounce="500"
            placeholder="Scan library barcode"
          />
        </traction-field-error>
      </fieldset>
    </div>
  </div>
</template>
<script>
/**
 * # ONTFlowcell
 *
 * Displays a panel for an individual flowcell. May be empty or contain a pool.
 */
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('traction/ont/runs')
const { mapActions } = createNamespacedHelpers('traction/ont/pools')
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
    return {
      barcodeState: true,
    }
  },
  computed: {
    flowcellIdValidationError() {
      // 3 letters followed by at least 3 numbers
      if (this.flowcellId) {
        const isValid = !!this.flowcellId.match(/^[a-zA-Z]{3}\d{3,}$/)
        return isValid ? '' : 'Enter at valid Flowcell ID (3 letters then at least 3 numbers)'
      }
      return ''
    },
    barcodeValidationError() {
      return this.barcode ? (this.barcodeState ? '' : 'Enter a valid Pool Library barcode') : ''
    },
    isFlowIdExists() {
      return !!this.flowcellId
    },
    isBarcodeExists() {
      return !!this.barcode
    },

    // For Vuex asynchronous validation we need to use computed getter and setter properties
    barcode: {
      get() {
        return this.poolTubeBarcode
      },
      async set(value) {
        const response = await this.validatePoolBarcode(value)
        this.setBarcodeState(response.success)
        this.setPoolTubeBarcode({ barcode: value, position: this.position })
      },
    },
    ...mapState({
      flowcellId(state) {
        const flowcell = state.currentRun.flowcell_attributes.find(
          (flowcell) => flowcell.position == this.position,
        )
        if (flowcell) {
          return flowcell.flowcell_id
        }
      },
      poolTubeBarcode(state) {
        const flowcell = state.currentRun.flowcell_attributes.find(
          (flowcell) => flowcell.position == this.position,
        )
        if (flowcell) {
          return flowcell.tube_barcode
        }
      },
      flowcell_id_field_colour() {
        return this.isFlowIdExists
          ? this.flowcellIdValidationError.length === 0
            ? 'border-3 border-solid border-green-600'
            : 'border-3 border-solid border-red-600 focus:border-red-600'
          : ''
      },
      flowcell_barcode_field_colour() {
        return this.barcode
          ? this.barcodeState
            ? 'border-3 border-solid border-green-600'
            : 'border-3 border-solid border-red-600 focus:border-red-600'
          : ''
      },
      flowcell_bg_colour() {
        if (!this.isFlowIdExists && !this.isBarcodeExists) return 'border border-3 border-white'

        if (this.flowcellIdValidationError.length > 0 || !this.barcodeState) {
          return 'border border-3 border-danger'
        }

        const validFlowId = this.isFlowIdExists && this.flowcellIdValidationError.length === 0
        const validBarcodeId = this.isBarcodeExists && this.barcodeState

        if (validFlowId && validBarcodeId) {
          return 'border border-3 border-success'
        }

        if ((validFlowId && !this.isBarcodeExists) || (validBarcodeId && !this.isFlowIdExists)) {
          return 'border border-3 border-warning'
        }
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
