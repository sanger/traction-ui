<template>
  <div data-type="ont-request-edit">
    <h1>Edit ONT Request</h1>
    <traction-form @keydown.enter.prevent>
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

      <traction-button data-action="update-request" theme="edit" @click="updateRequest">
        Update
      </traction-button>
    </traction-form>
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

const updateRequest = async () => {
  const { success, errors } = await store.updateRequest(request)
  console.log(errors)
  if (success) {
    showAlert(`Sample ${request.sample_name} updated successfully`, 'success')
  } else {
    showAlert(`Error updating sample ${request.sample_name}: ${errors}`, 'error')
  }
}
</script>
