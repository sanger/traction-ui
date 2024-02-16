<template>
  <div>
    <traction-button id="pacbioLibraryCreate" :disabled="disabled" theme="create" @click="show">
      Create Library
    </traction-button>
    <traction-modal
      id="pacbioLibraryModal"
      ref="modalRef"
      size="lg"
      title="Create Library"
      :static="isStatic"
      :visible="showModal"
      scrollable
      @cancel="hideModal"
    >
      <div>
        <label>The sample selected for this library is:</label>
        <br />
        {{ selectedSample.sample_name }} ({{ selectedSample.source_identifier }})
      </div>
      <PacbioLibraryForm ref="formRef" :library="library" />
      <template #modal-footer="{ cancel }">
        <traction-button @click="cancel()"> Cancel </traction-button>

        <traction-button id="create-btn" theme="create" @click="createLibrary">
          Create
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
  selectedSample: {
    type: Object,
    default() {
      return {}
    },
  },
})

// Define refs
const library = ref({ tag: '', sample: {} })
const selectedTagSetId = ref('')
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

const createLibrary = async () => {
  const { success, barcode, errors } = await librariesStore.createLibraryInTraction(
    formRef.value.formLibrary,
  )
  if (success) {
    hideModal()
    emitAlert('Created library with barcode ' + barcode, 'success')
  } else {
    showFailureMessage('create library', errors)
  }
}

const show = () => {
  library.value = { tag: "", sample: props.selectedSample }
  showModal.value = true
  selectedTagSetId.value = ''
}
const hideModal = () => {
  hide()
  showModal.value = false
}
provider()
</script>
