<template>
  <div v-if="store.selectedUsedAliquots" data-type="pool-library-list">
    <traction-table :fields="state.headerFields" simple>
      <PacbioPoolAliquotEdit
        v-for="aliquot in store.selectedUsedAliquots"
        :key="aliquot.source_id"
        :request="aliquot"
        :auto-tag="props.autoTag"
        :validated="props.validated"
        :notify="props.notify"
        :selected="selectedAliquotRequest && selectedAliquotRequest.source_id === aliquot.source_id"
        @aliquot-selected="(selected) => notifyAliquotSelection(selected, aliquot)"
      ></PacbioPoolAliquotEdit>
    </traction-table>
  </div>
</template>
<script setup>
/**
 * @name PacbioPoolAliquotList
 * @description Renders a list of pool aliquots
 * @param {Object} props
 * @param {Boolean} props.autoTag - Whether to automatically tag the aliquot
 * @param {Boolean} props.validated - Whether the attributes in child component(s) have been validated
 * @param {Function} props.notify - Callback function when user changes an attribute in a child component
 */
import { reactive, ref } from 'vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import PacbioPoolAliquotEdit from '@/components/pacbio/PacbioPoolAliquotEdit.vue'

const props = defineProps({
  autoTag: {
    type: Boolean,
    default: false,
  },
  // flag passed from parent indicating whether the attributes in child
  // component(s) have been validated
  validated: {
    type: Boolean,
    default: false,
  },
  // function passed from parent indicating what to do when user changes
  // an attribute in a child component
  notify: {
    type: Function,
    required: true,
    default: () => {},
  },
})

const store = usePacbioPoolCreateStore()
const emit = defineEmits(['aliquot-selected'])
const selectedAliquotRequest = ref(null)

/**
 * The fields to display in in the table
 */
const state = reactive({
  headerFields: [
    'Sample Name',
    'Source',
    'Tag',
    'Template prep kit box barcode',
    'Volume',
    'Concentration',
    'Insert Size',
  ],
})
const notifyAliquotSelection = (selected, aliquot) => {
  let aliquotOnSelection = aliquot
  if (!selected) {
    aliquotOnSelection = null
  }
  selectedAliquotRequest.value = aliquotOnSelection
  emit('aliquot-selected', aliquotOnSelection)
}
</script>
