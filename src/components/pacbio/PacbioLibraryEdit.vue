<template>
  <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
    <traction-heading level="3" class="mb-2"> Edit Library </traction-heading>
    <PacbioLibraryForm ref="formRef" :library="library" />
    <div class="flex flex-row items-center justify-end space-x-2 mt-3">
      <traction-button @click="emit('editCompleted')"> Cancel </traction-button>
      <traction-button
        id="update-btn"
        theme="edit"
        :disabled="errorInLibrary"
        @click="updateLibrary"
      >
        Update
      </traction-button>
    </div>
  </div>
</template>

<script setup>
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
 *
 * defineEmits: is a Vue 3 function that allows you to define emits in the setup function which is a replacement for the  emits option in Vue 2.
 * {@link} https://v3.vuejs.org/guide/component-custom-events.html#defining-custom-events
 */

/**
 * PacbioLibraryEdit component is used to edit a library.
 */

import { ref, computed } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import useAlert from '@/composables/useAlert.js'
import PacbioLibraryForm from '@/components/pacbio/PacbioLibraryForm.vue'

// Define props
const props = defineProps({
  library: {
    // library to be edited
    type: Object,
    default() {
      return {}
    },
  },
})

const formRef = ref(null) // Create a ref for the PacbioLibraryForm component

// useAlert is a composable function that is used to create an alert.It is used to show a success or failure message.
const { showAlert } = useAlert()

const emit = defineEmits(['editCompleted']) // Defines an emit function that emits a 'edit-completed' event.

/**
 * A Vue computed property that checks if there are any errors in the formLibrary.
 * It returns true if there is error in formLibrary and false otherwise.
 */
const errorInLibrary = computed(() => formRef.value?.formLibrary?.error?.length > 0)
/**
 * usePacbioLibrariesStore is a composable function that is used to access the 'pacbioLibraries' store.
 * It is used to create a new library.
 */
const librariesStore = usePacbioLibrariesStore()

/**
 * @method updateLibrary
 * Updates a library by calling the updateLibrary method from the 'pacbioLibraries' store.
 * If the update is successful, it shows a success message, otherwise shows a failure message.
 */
const updateLibrary = async () => {
  const { success, errors, updatedLibrary } = await librariesStore.updateLibrary(
    formRef.value.formLibrary,
  )
  if (success) {
    emit('editCompleted', updatedLibrary) // Emits a 'editCompleted' event which the parent component can listen to.
    showAlert('Updated library with barcode ' + props.library.barcode, 'success')
  } else {
    showAlert(`Failed to update library in Traction: ${errors}`, 'danger')
  }
}
</script>
