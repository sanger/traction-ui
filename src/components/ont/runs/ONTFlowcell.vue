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
          :classes="textSize"
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
            placeholder="Scan library barcode"
            :debounce="200"
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
 *
 * 'flowcellId' and 'barcode' can be in three states - empty, valid or invalid.
 * The border colour of input fields for 'flowCellId' and 'barcode' indicate these states as below
 * No border - empty value, green for a valid value and red for an invalid value
 *
 * The border colour of the panel displaying flowcell also depends on the states of 'flowcellId' and 'barcode'
 * green - if both flowcellId and barcode fields contain valid values
 * red - if any of flowcellId and barcode fields contain invalid values
 * white - if both flowcellId and barcode fields are empty
 * yellow - if one of flowcellId and barcode fields are valid and other is empty
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
      /**Represents whether the barcode is valid (=true) , invalid(=false) or empty(=null) */
      barcodeState: null,
      barcodeValue: '',
    }
  },
  computed: {
    /**Returns an error message if invalid otherwise an empty string */
    flowcellIdValidationError() {
      // 3 letters followed by at least 3 numbers
      if (this.flowcellId) {
        const isValid = !!this.flowcellId.match(/^[a-zA-Z]{3}\d{3,}$/)
        return isValid ? '' : 'Enter at valid Flowcell ID (3 letters then at least 3 numbers)'
      }
      return ''
    },
    /**Returns a message if invalid otherwise empty */
    barcodeValidationError() {
      return this.barcode ? (this.barcodeState ? '' : 'Enter a valid Pool Library barcode') : ''
    },
    /** Is the flowcellId empty or not */
    isFlowIdExists() {
      return !!this.flowcellId
    },
    /** Is the barcode field empty or not */
    isBarcodeExists() {
      return !!this.barcode
    },

    // For Vuex asynchronous validation we need to use computed getter and setter properties
    barcode: {
      get() {
        return this.barcodeValue
      },
      async set(value) {
        this.barcodeValue = value
        const response = await this.validatePoolBarcode(value)
        /*It is required to update the barcode here because components are externally 
            listening to this state */
        this.setPoolTubeBarcode({
          barcode: response.success ? value : undefined,
          position: this.position,
        })
        //response.success will be null for empty strings
        this.setBarcodeState(response.success)
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
          this.barcodeValue = flowcell.tube_barcode
          this.barcodeState = true
          return flowcell.tube_barcode
        }
      },
      /**Displays green if valid, red if invalid and no border if empty */
      flowcell_id_field_colour() {
        return this.isFlowIdExists
          ? this.flowcellIdValidationError.length === 0
            ? 'border-3 border-solid border-green-600'
            : 'border-3 border-solid border-red-600 focus:border-red-600'
          : ''
      },
      /**Displays green if valid, red if invalid and no border if empty */
      flowcell_barcode_field_colour() {
        return this.isBarcodeExists
          ? this.barcodeState
            ? 'border-3 border-solid border-green-600'
            : 'border-3 border-solid border-red-600 focus:border-red-600'
          : ''
      },
      /**
       * green - if both flowcellId and barcode fields contain valid values
       * red - if any of flowcellId and barcode fields contain invalid values
       * white - if both flowcellId and barcode fields are empty
       * yellow - if one of flowcellId and barcode fields are valid and other is empty
       */
      flowcell_bg_colour() {
        if (!this.isFlowIdExists && !this.isBarcodeExists) return 'border border-3 border-white'

        const validFlowId = this.isFlowIdExists && this.flowcellIdValidationError.length === 0
        const validBarcodeId = this.isBarcodeExists && this.barcodeState

        if (validFlowId && validBarcodeId) {
          return 'border border-3 border-success'
        }

        if ((validFlowId && !this.isBarcodeExists) || (validBarcodeId && !this.isFlowIdExists)) {
          return 'border border-3 border-warning'
        }

        if (
          this.flowcellIdValidationError.length > 0 ||
          (this.isBarcodeExists && !this.barcodeState)
        ) {
          return 'border border-3 border-danger'
        }
      },
      textSize() {
        return 'text-sm'
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
