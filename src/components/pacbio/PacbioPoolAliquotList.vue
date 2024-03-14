<template>
  <div v-if="store.selectedRequests" data-type="pool-library-list">
    <traction-table :fields="state.headerFields" simple>
      <PacbioPoolAliquotEdit
        v-for="request in store.selectedRequests"
        :key="request.id"
        :request="request"
        :auto-tag="props.autoTag"
        :validated="props.validated"
        :notify="props.notify"
      ></PacbioPoolAliquotEdit>
    </traction-table>
  </div>
</template>
<script setup>
import { defineProps, reactive } from 'vue'
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
</script>
