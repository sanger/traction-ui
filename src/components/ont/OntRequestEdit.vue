<template>
  <div
    data-type="ont-request-edit"
    class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm"
  >
    <traction-heading level="3" class="mb-2"> Edit Library </traction-heading>
    <traction-form
      class="flex flex-row rounded-md justify-between space-x-2 p-2 bg-gray-200"
      @keydown.enter.prevent
    >
      <fieldset>
        <traction-label class="ml-1">Source Identifier</traction-label>
        <div data-attribute="source-identifier">
          {{ request.source_identifier }}
        </div>
      </fieldset>
      <fieldset>
        <traction-label class="ml-1">Sample Name</traction-label>
        <div data-attribute="sample-name">
          {{ request.sample_name }}
        </div>
      </fieldset>
      <fieldset>
        <traction-label class="ml-1">Library Type</traction-label>
        <div data-attribute="library-type">
          {{ request.library_type }}
        </div>
      </fieldset>
      <fieldset>
        <traction-label class="ml-1">Data Type</traction-label>
        <div data-attribute="data-type">
          {{ request.data_type }}
        </div>
      </fieldset>
      <fieldset>
        <traction-label class="ml-1">Number of Flowcells</traction-label>
        <div data-attribute="number-of-flowcells">
          {{ request.number_of_flowcells }}
        </div>
      </fieldset>
      <fieldset>
        <traction-label class="ml-1">Cost Code</traction-label>
        <traction-input v-model="request.cost_code" data-attribute="cost-code" />
      </fieldset>
    </traction-form>
    <div class="flex flex-row items-center justify-end space-x-2 mt-3">
      <traction-button data-action="cancel-edit" theme="edit" @click="emit('editCompleted')">
        Cancel
      </traction-button>
      <traction-button data-action="update-request" theme="edit" @click="updateRequest">
        Update
      </traction-button>
    </div>
  </div>
</template>

<script setup>
import { useOntRequestsStore } from '@/stores/ontRequests.js'
import { reactive } from 'vue'
import useAlert from '@/composables/useAlert.js'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const store = useOntRequestsStore()
const request = reactive({ ...store.resources.requests[props.id] })
const { showAlert } = useAlert()
const emit = defineEmits(['editCompleted'])

const updateRequest = async () => {
  const { success, errors } = await store.updateRequest(request)
  console.log(errors)
  if (success) {
    emit('editCompleted')
    showAlert(`Sample ${request.sample_name} updated successfully`, 'success')
  } else {
    showAlert(`Error updating sample ${request.sample_name}: ${errors}`, 'error')
  }
}
</script>
