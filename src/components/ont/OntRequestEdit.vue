<template>
  <div>
    <h1>Edit ONT Request</h1>
    <traction-form @keydown.enter.prevent>
      <fieldset data-type="cost-code-input">
        <traction-label class="ml-1">Cost code</traction-label>
        <traction-input v-model="request.cost_code" data-attribute="cost-code" />
      </fieldset>
      <traction-button
        data-action="update-request"
        theme="edit"
        :disabled="errorInRequest"
        @click="updateRequest"
      >
        Update
      </traction-button>
    </traction-form>
  </div>
</template>

<script setup>
import { useOntRequestsStore } from '@/stores/ontRequests.js'
import { reactive, ref } from 'vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const store = useOntRequestsStore()
const request = reactive({ ...store.resources.requests[props.id] })
const errorInRequest = ref(false)

const updateRequest = async () => {
  const { success, errors } = await store.updateRequest(request)
  if (success) {
    // Handle success, e.g., show a notification or redirect
  } else {
    errorInRequest.value = true
    // Handle errors, e.g., show an error message
    console.error(errors)
  }
}
</script>
