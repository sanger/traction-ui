<template>
  <div :class="`${isDisplayLibraryForm && 'mt-6'}`">
    <traction-button
      v-if="!isDisplayLibraryForm"
      id="pacbioLibraryCreate"
      :disabled="!selectedSample.sample_name"
      theme="create"
      @click="toggleDisplayCreatePanel"
    >
      {{ 'Create Library' }}
    </traction-button>
    <div
      v-if="isDisplayLibraryForm"
      class="p-4 ml-4 mb-4 mt-2 rounded-md text-left items-center border-2 border-gray-200 shadow-sm"
    >
      <traction-heading level="3" show-border shadow-md class="mb-2">
        Create Library
      </traction-heading>
      <div class="mb-2">
        <label>The sample selected for this library is:</label>
        <br />
        {{ selectedSample.sample_name }} ({{ selectedSample.source_identifier }})
      </div>
      <PacbioLibraryForm ref="formRef" :library="library" />
      <div class="flex flex-row items-center justify-end space-x-2 mt-3">
        <traction-button id="cancel-btn" @click="toggleDisplayCreatePanel">
          Cancel
        </traction-button>
        <traction-button id="create-btn" theme="create" @click="createLibrary">
          Create
        </traction-button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * PacbioLibraryCreate component is used to create a new library for a selected sample.
 * script setup is a Vue 3 function that allows you to define props, reactive variables, and computed properties in the setup function.
 * The following code defines the reactive variables, computed properties, and methods for the PacbioLibraryCreate component.
 */
import { computed, ref } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries'
import useAlert from '@/composables/useAlert.js'
import PacbioLibraryForm from '@/components/pacbio/PacbioLibraryForm.vue'

/**
 * Following are new Vue 3 features used in this component:
 * 
 * script setup : is a Vue 3 function that allows you to define props, reactive variables, and computed properties in the setup function.
 *
 * ref:  is a Vue 3 function that allows you to create a reactive object which is a replacement for the data option in Vue 2
 * ref() takes the argument and returns it wrapped within a ref object with a .value property:
 * e.g : ref(0) returns { value: 0 }
 * To access the value, you use the .value property in setup function, but in the template, you can use the variable directly.
 * {@link} https://v3.vuejs.org/guide/reactivity-fundamentals.html#ref
 
 * Composables: are a new Vue 3 feature that allows you to create reusable logic.
 * {@link} https://vuejs.org/guide/reusability/composables
 *
 * computed: is a Vue 3 function that allows you to create a computed property.
 * It is a replacement for the computed option in Vue 2.
 * {@link} https://v3.vuejs.org/guide/reactivity-computed-watchers.html#computed-properties
 *
 * defineProps: is a Vue 3 function that allows you to define props in the setup function which is a replacement for the  props option in Vue 2.
 * {@link} https://v3.vuejs.org/guide/component-props.html#prop-validation
 
 */

/**
 * PacbioLibraryCreate component is used to create a new library for a selected sample.
 */

// Define props
const props = defineProps({
  disabled: Boolean,
  isStatic: Boolean,
  selectedSample: {
    type: Object,
    required: true,
    default() {
      return {}
    },
    required: true,
  },
})

// Define refs
const library = ref({ tag: { id: '' }, sample: {} })
const selectedTagSetId = ref('')
const showModal = ref(false)
const modalRef = ref(null)

//Composables
const { showAlert } = useAlert()
const { hide } = useModalHelper(modalRef.value)

// Define emits
const emit = defineEmits(['alert'])
//Emits the 'alert' event
const emitAlert = (message) => {
  emit('alert', message)
}

//Create Pinia store
const librariesStore = usePacbioLibrariesStore()

// Define computed

const tagSetOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag set' }
  return [placeholder, ...librariesStore.tagSetChoices]
})

const tagOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag' }
  return [placeholder, ...librariesStore.tagChoicesForId(selectedTagSetId.value)]
})

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

const resetSelectedTagId = () => {
  library.value.tag.id = ''
}

const createLibrary = async () => {
  const { success, barcode, errors } = await librariesStore.createLibraryInTraction(
    formRef?.value?.formLibrary,
  )
  if (success) {
    hideModal()
    emitAlert('Created library with barcode ' + barcode, 'success')
  } else {
    showFailureMessage('create library', errors)
  }
}

const show = () => {
  library.value = { tag: { id: '' }, sample: props.selectedSample }
  showModal.value = true
  selectedTagSetId.value = ''
}
const hideModal = () => {
  hide()
  showModal.value = false
}
provider()
</script>
