<template>
  <div v-if="selectedRequests" data-type="pool-library-list">
    <traction-table :fields="headerFields" simple>
      <OntPoolLibraryEdit
        v-for="request in selectedRequests"
        :key="request.id"
        :request="request"
        :auto-tag="autoTag"
        :validated="validated"
        :notify="notify"
      ></OntPoolLibraryEdit>
    </traction-table>
  </div>
</template>

<script setup>
/**
 * # OntPoolLibraryList
 *
 * Displays a list of libraries from the ont pool libraries store.
 * Uses the Pinia ontPoolCreate store for state.
 */
import OntPoolLibraryEdit from '@/components/ont/OntPoolLibraryEdit.vue'
import { computed } from 'vue'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

// Props
defineProps({
  autoTag: {
    type: Boolean,
    default: false,
  },
  validated: {
    type: Boolean,
    default: false,
  },
  notify: {
    type: Function,
    default: () => {},
  },
})

// Local state
const headerFields = [
  'Sample Name',
  'Source',
  'Tag',
  'Kit barcode',
  'Volume',
  'Concentration',
  'Insert Size',
]

// Pinia store
const ontPoolCreateStore = useOntPoolCreateStore()
const selectedRequests = computed(() => ontPoolCreateStore.selectedRequests)
</script>
