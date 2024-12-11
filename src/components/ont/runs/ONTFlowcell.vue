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
              :error="flowcellErrorsFor('flowcell_id')"
              :with-icon="!!flowCell.errors?.flowcell_id"
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
              :error="flowcellErrorsFor('tube_barcode')"
              :with-icon="!!flowCell.errors?.tube_barcode"
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
import { mapState, mapActions as mapActionsPinia } from 'pinia'
import { useOntRunsStore } from '@/stores/ontRuns'
import { flowCellType } from '@/stores/utilities/flowCell'
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
  computed: {
    ...mapState(useOntRunsStore, ['currentRun', 'getFlowCell']),
    // For Vuex asynchronous validation we need to use computed getter and setter properties
    barcode: {
      get() {
        return this.flowCell.tube_barcode
      },
      async set(value) {
        this.flowCell.tube_barcode = value
        await this.fetchPool(value)
        this.flowCell.validateBarcode()
      },
    },
    flowcellId: {
      get() {
        return this.flowCell.flowcell_id
      },
      async set(value) {
        this.flowCell.flowcell_id = value
        this.flowCell.validateFlowcellId()
      },
    },
    flowCell() {
      //If flowcell is not present in the store, return a new empty flowcell
      //(this is reduce the number of null checks in validations)
      return this.getFlowCell(this.position) ?? { ...flowCellType() }
    },
    /**Displays green if valid, red if invalid and no border if empty */
    flowcell_id_field_colour() {
      return this.flowCell.flowcell_id
        ? !this.flowcellErrorsFor('flowcell_id')
          ? 'border-3 border-solid border-success'
          : 'border-3 border-solid border-failure focus:border-failure'
        : ''
    },

    /**Displays green if valid, red if invalid and no border if empty */
    flowcell_barcode_field_colour() {
      return this.flowCell.tube_barcode
        ? !this.flowcellErrorsFor('tube_barcode')
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
      const tube_barcode_errors = this.flowcellErrorsFor('tube_barcode')
      const flowcell_id_errors = this.flowcellErrorsFor('flowcell_id')
      if (
        !flowcell_id_errors &&
        !tube_barcode_errors &&
        this.flowCell.tube_barcode &&
        this.flowCell.flowcell_id
      )
        return 'border border-3 border-success'
      else if (flowcell_id_errors && tube_barcode_errors) return 'border border-3 border-failure'
      else if (flowcell_id_errors || tube_barcode_errors) return 'border border-3 border-yellow'
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
    ...mapActionsPinia(useOntRunsStore, ['setNewFlowCell', 'fetchPool']),
    // Checks if the pool attribute should be displayed with an error
    flowcellErrorsFor(attribute) {
      return this.flowCell?.errors?.[attribute]
    },
    formatter(value) {
      return value.toUpperCase().trim()
    },
  },
}
</script>
