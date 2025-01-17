<template>
  <div>
    <traction-button :id="generateId('editSample', req.id)" size="sm" theme="edit" @click="show"
      >Edit</traction-button
    >

    <traction-modal
      id="editSampleModal"
      ref="modal"
      title="Edit Sample"
      :visible="showModal"
      @cancel="hide"
    >
      <traction-form id="sampleMetaDataForm">
        <LibraryTypeSelect
          v-model="request.library_type"
          pipeline="pacbio"
          :import="false"
          :label-cols="null"
        />

        <fieldset id="estimateOfGBRequired" class="py-2">
          <label>Estimate of GB required:</label>
          <traction-input
            id="estimateOfGBRequired"
            v-model="request.estimate_of_gb_required"
            placeholder="Estimate of GB required"
          >
          </traction-input>
        </fieldset>

        <fieldset id="numberOfSMRTCells" class="py-2">
          <label>Number of SMRT Cells:</label>
          <traction-input
            id="numberOfSMRTCells"
            v-model="request.number_of_smrt_cells"
            placeholder="Number of SMRT Cells"
          >
          </traction-input>
        </fieldset>

        <fieldset id="costCode" class="py-2">
          <label>Cost Code:</label>
          <traction-input id="costCode" v-model="request.cost_code" placeholder="Cost Code">
          </traction-input>
        </fieldset>
      </traction-form>

      <template #modal-footer="{ cancel }">
        <traction-button @click="cancel()"> Cancel </traction-button>

        <traction-button theme="update" @click="update()"> Update Sample </traction-button>
      </template>
    </traction-modal>
  </div>
</template>

<script setup>
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect.vue'
import { reactive, ref } from 'vue'
import useAlert from '@/composables/useAlert.js'
import useModalHelper from '@/composables/useModalHelper.js'
import { usePacbioRequestsStore } from '@/stores/pacbioRequests.js'

const requestsStore = usePacbioRequestsStore()

// Define the props for the component
const props = defineProps({
  req: {
    type: Object,
    default: () => ({}),
  },
})

// Reactive object to hold the request data
const request = reactive({
  library_type: '',
  estimate_of_gb_required: '',
  number_of_smrt_cells: '',
  cost_code: '',
})

// Ref to control the visibility of the modal
const showModal = ref(false)

const { hideModal } = useModalHelper()

// Function to update the request
const update = async () => {
  await requestsStore.updateRequest(request).then(({ success, errors }) => {
    success
      ? alert('Sample updated', 'success')
      : alert('Failed to update sample. ' + errors, 'danger')
  })
  hide()
}

// Function to generate a unique ID
const generateId = (text, id) => {
  return `${text}-${id}`
}

const { showAlert } = useAlert()

// Function to show the modal and populate the request data
const show = () => {
  showModal.value = true
  Object.assign(request, props.req)
}

// Function to hide the modal
const hide = () => {
  showModal.value = false
  hideModal()
}

// Function to show an alert message
const alert = (message, type) => {
  showAlert(message, type)
}
</script>
