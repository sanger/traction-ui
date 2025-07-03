<template>
  <div class="mt-8">
    <traction-section number="2b" title="Selected Tubes">
      <traction-table
        :items="selectedTubeRequests"
        :fields="requestFields"
        empty-text="No tubes selected"
      >
        <template #cell(action)="row">
          <traction-button
            :id="'add-btn-' + row.item.id"
            size="sm"
            class="mr-2"
            theme="default"
            :disabled="isButtonDisabled(row.item.id)"
            @click="addTubeToPool(row.item.id)"
          >
            +
          </traction-button>
          <traction-button
            :id="'del-btn-' + row.item.id"
            size="sm"
            class="mr-2"
            theme="default"
            :disabled="!isButtonDisabled(row.item.id)"
            @click="removeTubeFromPool(row.item.id)"
          >
            -
          </traction-button>
          <traction-button
            :id="'remove-btn-' + row.item.id"
            size="sm"
            class="mr-2"
            theme="default"
            @click="ontPoolCreateStore.deselectTubeAndContents(row.item.source_identifier)"
          >
            Remove
          </traction-button>
        </template>
      </traction-table>
    </traction-section>
  </div>
</template>

<script setup>
/**
 * # OntTubeSelectedList
 *
 * Displays a list of tube requests that are in the ont selected store
 */
import { computed } from 'vue'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

// Pinia store
const ontPoolCreateStore = useOntPoolCreateStore()

const requestFields = [
  { key: 'id', label: 'ID' },
  { key: 'sample_name', label: 'Sample Name' },
  { key: 'source_identifier', label: 'Source Identifier' },
  { key: 'data_type', label: 'Data Type' },
  { key: 'library_type', label: 'Library Type' },
  { key: 'number_of_flowcells', label: 'Number of Flowcells' },
  { key: 'action', label: 'Action' },
]

// Computed properties
const selectedTubeRequests = computed(() => {
  return ontPoolCreateStore.selectedTubes.flatMap((tube) => {
    return ontPoolCreateStore.requestList(tube.requests || [])
  })
})

// Methods
const isButtonDisabled = (id) => {
  return ontPoolCreateStore.selectedRequests.find((request) => request.id === id)
}

const addTubeToPool = (id) => {
  ontPoolCreateStore.selectRequest(id)
}

const removeTubeFromPool = (id) => {
  ontPoolCreateStore.selectRequest(id, false)
}
</script>
