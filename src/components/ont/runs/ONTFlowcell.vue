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
              :with-icon="!!flowCell.flowcell_id"
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
              :with-icon="!!flowCell.tube_barcode"
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
<script setup>
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
import { useOntRunCreateStore } from '@/stores/ontRunCreate.js'
import { computed } from 'vue'

const props = defineProps({
  position: {
    type: Number,
    required: true,
  },
  coordinate: {
    type: String,
    required: true,
  },
})

const ontRunCreateStore = useOntRunCreateStore()

const flowCell = computed(() => ontRunCreateStore.getOrCreateFlowCell(props.position))

const barcode = computed({
  get() {
    return flowCell.value.tube_barcode
  },
  async set(value) {
    flowCell.value.tube_barcode = value
    await ontRunCreateStore.fetchPool(value)
    flowCell.value.validateBarcode()
  },
})

const flowcellId = computed({
  get() {
    return flowCell.value.flowcell_id
  },
  async set(value) {
    flowCell.value.flowcell_id = value
    flowCell.value.validateFlowCellId()
  },
})

/**Displays green if valid, red if invalid and no border if empty */
const flowcell_id_field_colour = computed(() => {
  return flowCell.value.flowcell_id
    ? !flowcellErrorsFor('flowcell_id')
      ? 'border-3 border-solid border-success'
      : 'border-3 border-solid border-failure focus:border-failure'
    : ''
})

/**Displays green if valid, red if invalid and no border if empty */
const flowcell_barcode_field_colour = computed(() => {
  return flowCell.value.tube_barcode
    ? !flowcellErrorsFor('tube_barcode')
      ? 'border-3 border-solid border-success'
      : 'border-3 border-solid border-failure focus:border-failure'
    : ''
})

/**
 * green - if both flowcellId and barcode fields contain valid values
 * red - if any of flowcellId and barcode fields contain invalid values
 * gray - if both flowcellId and barcode fields are empty
 * yellow - if one of flowcellId and barcode fields are valid and other is empty
 */
const flowcell_bg_colour = computed(() => {
  const tube_barcode_errors = flowcellErrorsFor('tube_barcode')
  const flowcell_id_errors = flowcellErrorsFor('flowcell_id')
  // If the flowcell is empty return gray border
  if (!flowCell.value.tube_barcode && !flowCell.value.flowcell_id) {
    return 'border border-3 border-gray-300'
  }

  // If there are errors in either of the fields return red border
  if (!!flowcell_id_errors || !!tube_barcode_errors) return 'border border-3 border-failure'

  // If either field is empty return yellow border
  if (!flowCell.value.tube_barcode || !flowCell.value.flowcell_id)
    return 'border border-3 border-warning'

  // If both fields are valid return green border
  return 'border border-3 border-success'
})

// Checks if the pool attribute should be displayed with an error
const flowcellErrorsFor = (attribute) => {
  return flowCell.value?.errors?.[attribute]
}

const formatter = (value) => {
  return value.toUpperCase().trim()
}
</script>
