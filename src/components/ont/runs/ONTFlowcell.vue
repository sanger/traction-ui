<template>
  <div>
    <div
      style="width: 200px; height: 320px"
      class="rounded-lg overflow-hidden border-2 shadow-lg whitespace-nowrap"
      :class="flowcell_bg_colour"
    >
      <div class="`text-xl p-2 text-gray-500 border-b-2">
        {{ coordinate }}
      </div>
      <div class="flex flex-col h-full px-2 py-8 bg-blue-100">
        <div class="flex flex-col mt-2 py-3 justify-center space-y-4">
          <fieldset id="input-group-flowcell-id">
            <label class="flex justify-start text-sm ml-1 text-gray-600">Flowcell ID</label>
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
                :classes="`${flowcell_id_field_colour} text-gray-600 text-sm`"
                class="w-full"
              />
            </traction-field-error>
          </fieldset>
          <fieldset id="input-group-pool-id">
            <label class="flex justify-start text-sm ml-1 mt-1 text-gray-600"
              >Pool Library Barcode</label
            >
            <traction-field-error
              id="input-pool-tube-barcode-feedback"
              :error="barcodeValidationError"
              :with-icon="isBarcodeExists"
            >
              <traction-input
                :id="'pool-id-' + position"
                v-model="barcode"
                :formatter="formatter"
                :classes="`${flowcell_barcode_field_colour} text-gray-600 text-sm`"
                class="w-full"
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
import { mapState, mapActions as mapActionsPinia } from 'pinia'
import { useOntRunsStore } from '@/stores/ontRuns'
const { mapActions } = createNamespacedHelpers('traction/ont/pools')
import { FlowCellStateEnum, FieldStatusEnum, flowCellType } from '@/stores/utilities/flowCell'
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
      /**Represents the current flowCell Validation state */
      flowCellValidationState: {
        statusId: FieldStatusEnum.Empty,
        statusBarcode: FieldStatusEnum.Empty,
        errorBarcode: '',
        errorId: '',
        state: FlowCellStateEnum.Empty,
      },
    }
  },
  computed: {
    ...mapState(useOntRunsStore, ['currentRun', 'getFlowCell']),
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
        //Validate barcode field of flowcell
        const validation = await this.flowCell.validateFlowCell(
          false,
          true,
          this.flowCellValidationState,
        )
        this.setFlowCellValidation(validation)
      },
    },
    flowcellId: {
      get() {
        const flowCell = this.getFlowCell(this.position)
        if (flowCell) {
          return this.getFlowCell(this.position).flowcell_id
        }
        return ''
      },
      async set(value) {
        this.setFlowcellId({ $event: value, position: this.position })
        //Validate flowcell id field of flowcell
        const validation = await this.flowCell.validateFlowCell(
          true,
          false,
          this.flowCellValidationState,
        )
        this.setFlowCellValidation(validation)
      },
    },
    flowCell() {
      //If flowcell is not present in the store, return a new empty flowcell
      //(this is reduce the number of null checks in validations)
      return this.getFlowCell(this.position) ?? { ...flowCellType }
    },

    poolTubeBarcode() {
      return this.flowCell.tube_barcode
    },
    flowcellIdValidationError() {
      return this.flowCellValidationState.errorId
    },
    isFlowcellIdExists() {
      return this.flowCellValidationState.statusId !== FieldStatusEnum.Empty
    },
    barcodeValidationError() {
      return this.flowCellValidationState.errorBarcode
    },
    isBarcodeExists() {
      return this.flowCellValidationState.statusBarcode !== FieldStatusEnum.Empty
    },
    /**Displays green if valid, red if invalid and no border if empty */
    flowcell_id_field_colour() {
      return this.flowCellValidationState.statusId !== FieldStatusEnum.Empty
        ? this.flowCellValidationState.errorId.length === 0
          ? 'border-3 border-solid border-success'
          : 'border-3 border-solid border-failure focus:border-failure'
        : ''
    },

    /**Displays green if valid, red if invalid and no border if empty */
    flowcell_barcode_field_colour() {
      return this.flowCellValidationState.statusId !== FieldStatusEnum.Empty
        ? this.flowCellValidationState.errorId.length === 0
          ? 'border-3 border-solid border-success'
          : 'border-3 border-solid border-failure focus:border-failure'
        : ''
    },
    /**
     * green - if both flowcellId and barcode fields contain valid values
     * red - if any of flowcellId and barcode fields contain invalid values
     * white - if both flowcellId and barcode fields are empty
     * yellow - if one of flowcellId and barcode fields are valid and other is empty
     */
    flowcell_bg_colour() {
      const state = this.flowCellValidationState.state
      if (state === FlowCellStateEnum.Success) return 'border border-3 border-success'
      if (state === FlowCellStateEnum.Failure) return 'border border-3 border-failure'
      if (state === FlowCellStateEnum.Warning) return 'border border-3 border-warning'
      else return 'border border-3 border-gray-300'
    },
  },
  /**
   * If flowcell is not present in the store, set a new flowcell
   * This is required to display empty flowcells
   */
  mounted() {
    const flowCell = this.getFlowCell(this.position)
    if (!flowCell) this.setNewFlowCell(this.position)
  },
  methods: {
    ...mapActionsPinia(useOntRunsStore, ['setFlowcellId', 'setPoolTubeBarcode', 'setNewFlowCell']),
    ...mapActions(['validatePoolBarcode']),
    formatter(value) {
      return value.toUpperCase().trim()
    },
    setBarcodeState(state) {
      this.barcodeState = state
    },
    setFlowCellValidation(validation) {
      this.flowCellValidationState = validation
    },
  },
}
</script>
