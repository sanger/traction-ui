<template>
  <div>
    <traction-button id="pacbioLibraryEdit" :disabled="disabled" theme="edit" @click="show">
      Edit
    </traction-button>
    <traction-modal
      id="pacbioLibraryModal"
      ref="modalRef"
      size="lg"
      title="Edit Library"
      :static="isStatic"
      :visible="showModal"
      scrollable
      @cancel="hideModal"
    >
      <PacbioLibraryForm
        ref="formRef"
        :library="library"
        :sample="selectedSample"
        @submitLibrary="editLibrary"
      />
      <template #modal-footer="{ cancel }">
        <traction-button @click="cancel()"> Cancel </traction-button>
        <traction-button id="update-btn" theme="edit" @click="updateLibrary">
          Update
        </traction-button>
      </template>
    </traction-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries'
import useAlert from '@/composables/useAlert.js'
import useModalHelper from '@/composables/useModalHelper.js'
import PacbioLibraryForm from '@/components/pacbio/PacbioLibraryForm.vue'
// Define props
const props = defineProps({
  disabled: Boolean,
  isStatic: Boolean,
  library: {
    type: Object,
    default() {
      return {}
    },
  },
})

// Define refs
const showModal = ref(false)
const modalRef = ref(null)
const formRef = ref(null)
//Composables
const { showAlert } = useAlert()
const { hide } = useModalHelper(modalRef.value)

// Define emits
const emit = defineEmits(['alert'])
//Emits the 'alert' event
const emitAlert = (message) => emit('alert', message)

//Create Pinia store
const librariesStore = usePacbioLibrariesStore()

// Define methods

// Show a failure message
const showFailureMessage = (action, errors) => {
  showAlert(`Failed to ${action} in Traction: ${errors.length > 0 ? errors[0] : ''}`, 'danger')
}

// Define provider method
const provider = async () => {
  try {
    const { success, errors } = await librariesStore.fetchPacbioTagSets()
    if (!success) {
      showFailureMessage('find tags', errors)
    }
  } catch (error) {
    showFailureMessage('find tags', [error.message])
  }
}

const updateLibrary = async () => {
  const { success, errors } = await librariesStore.updateLibrary(formRef.value.formLibrary)
  if (success) {
    hideModal()
    emitAlert('Updated library with barcode ' + props.library.tube.barcode, 'success')
  } else {
    showFailureMessage('update library', errors)
  }
}

const show = () => {
  showModal.value = true
}
const hideModal = () => {
  hide()
  showModal.value = false
}
provider()
</script>
