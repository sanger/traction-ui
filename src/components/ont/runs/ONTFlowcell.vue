<template>
  <div>
    <div
      style="width: 200px; height: 400px"
      class="rounded-lg overflow-hidden border-2 shadow-lg whitespace-nowrap"
      :class="flowcell_bg_colour"
    >
      <div class="text-xl p-2 text-gray-600 border-b-2" :class="flowcell_bg_colour">
        {{ coordinate }}
      </div>
      <!-- <div class="border border-gray-300" /> -->
      <div class="flex h-full px-3 bg-gray-300 items-center justify-center">
        <div class="flex flex-col space-y-4">
          <fieldset id="input-group-flowcell-id">
            <label class="flex justify-start text-md">Flowcell ID</label>
            <traction-field-error
              id="input-flowcell-id-feedback"
              :error="flowcellIdValidationError"
              :with-icon="isFlowcellIdExists"
            >
              <traction-input
                :id="'flowcell-id-' + position"
                v-model="flowcellId"
                placeholder="Scan flowcell ID"
                :formatter="formatter"
                :classes="flowcell_id_field_colour"
              />
            </traction-field-error>
          </fieldset>
          <fieldset id="input-group-pool-id">
            <label class="flex justify-start">Pool Library Barcode</label>
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
                :debounce="500"
              />
            </traction-field-error>
          </fieldset>
        </div>
      </div>
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
const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('traction/ont/runs')
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
      barcodeState: true,
    }
  },
  computed: {
    /**Returns an error message if invalid otherwise an empty string */
    flowcellIdValidationError() {
      // 3 letters followed by at least 3 numbers
      if (this.flowcellId) {
        return this.flowcellId.match(/^[a-zA-Z]{3}\d{3,}$/)
          ? ''
          : 'Enter at valid Flowcell ID (3 letters then at least 3 numbers)'
      }
      return ''
    },
    /**Returns a message if invalid otherwise empty */
    barcodeValidationError() {
      return this.barcode ? (this.barcodeState ? '' : 'Enter a valid Pool Library barcode') : ''
    },
    /** Is the flowcellId empty or not */
    isFlowcellIdExists() {
      return !!this.flowcellId
    },
    /** Is the barcode field empty or not */
    isBarcodeExists() {
      return !!this.barcode
    },
    // For Vuex asynchronous validation we need to use computed getter and setter properties
    barcode: {
      get() {
        return this.poolTubeBarcode
      },
      async set(value) {
        /*It is required to update the barcode here because components are externally 
          listening to this state */
        this.setPoolTubeBarcode({
          barcode: value,
          position: this.position,
        })
        const response = await this.validatePoolBarcode(value)
        //response.success will be null for empty strings
        this.setBarcodeState(response.success)
      },
    },
    flowcellId: {
      get() {
        const flowcell = this.currentRun().flowcell_attributes.find(
          (flowcell) => flowcell.position == this.position,
        )
        if (flowcell) {
          return flowcell.flowcell_id
        }
        return ''
      },
      set(value) {
        this.setFlowcellId({ $event: value, position: this.position })
      },
    },
    ...mapState({
      poolTubeBarcode(state) {
        const flowcell = state.currentRun.flowcell_attributes.find(
          (flowcell) => flowcell.position == this.position,
        )
        if (flowcell) {
          return flowcell.tube_barcode
        }
      },
      /**Displays green if valid, red if invalid and no border if empty */
      flowcell_id_field_colour() {
        return this.isFlowcellIdExists
          ? this.flowcellIdValidationError.length === 0
            ? 'border-3 border-solid border-green-400'
            : 'border-3 border-solid border-red-600 focus:border-red-600'
          : ''
      },
      /**Displays green if valid, red if invalid and no border if empty */
      flowcell_barcode_field_colour() {
        return this.isBarcodeExists
          ? this.barcodeState
            ? 'border-3 border-solid border-green-400'
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
        if (!this.isFlowcellIdExists && !this.isBarcodeExists) return 'border border-3 border-white'

        const validFlowId = this.isFlowcellIdExists && this.flowcellIdValidationError.length === 0
        const validBarcodeId = this.isBarcodeExists && this.barcodeState

        if (validFlowId && validBarcodeId) {
          return 'border border-3 border-green-400'
        }

        if (
          (validFlowId && !this.isBarcodeExists) ||
          (validBarcodeId && !this.isFlowcellIdExists)
        ) {
          return 'border border-3 border-yellow-400'
        }

        if (
          this.flowcellIdValidationError.length > 0 ||
          (this.isBarcodeExists && !this.barcodeState)
        ) {
          return 'border border-3 border-red-600'
        }
      },
    }),
  },
  methods: {
    ...mapMutations(['setFlowcellId', 'setPoolTubeBarcode']),
    ...mapActions(['validatePoolBarcode']),
    ...mapGetters(['currentRun']),
    formatter(value) {
      return value.toUpperCase().trim()
    },
    setBarcodeState(state) {
      this.barcodeState = state
    },
  },
}
</script>
