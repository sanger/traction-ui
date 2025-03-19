<template>
  <div>
    <traction-button
      v-if="!isDisplayLibraryForm"
      id="pacbioLibraryCreate"
      :disabled="!selectedSample.sample_name"
      theme="create"
      @click="toggleDisplayCreatePanel"
    >
      Create Library
    </traction-button>
    <div
      v-if="isDisplayLibraryForm"
      class="p-4 ml-4 mb-4 mt-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm"
    >
      <traction-heading level="3" show-border shadow-md class="mb-2">
        Create Library
      </traction-heading>
      <div class="mb-4 text-base italic text-gray-700">
        <label v-if="selectedSample.sample_name"
          >The sample selected for this library is: {{ selectedSample.sample_name }} ({{
            selectedSample.source_identifier
          }})</label
        >
        <label v-else class="text-red-600">No sample selected</label>
      </div>
      <PacbioLibraryForm ref="formRef" :library="library" />
      <div class="flex flex-row items-center justify-end space-x-2 mt-3">
        <traction-button id="cancel-btn" @click="toggleDisplayCreatePanel">
          Cancel
        </traction-button>
        <traction-button
          id="create-btn"
          theme="create"
          :disabled="!selectedSample.sample_name"
          @click="createLibrary"
        >
          Create
        </traction-button>
      </div>
    </div>
  </div>
</template>

<script setup>
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

//define props
const props = defineProps({
  selectedSample: {
    //The selected sample for which the library is being created.
    type: Object,
    default() {
      return {}
    },
  },
})

const formRef = ref(null) // Create a ref for the PacbioLibraryForm component

/**
 * Create a ref for the isDisplayLibraryForm variable which is used to toggle the display of the create panel.
 * If isDisplayLibraryForm is true, the library form is displayed, otherwise displays a 'Create' button.
 */
const isDisplayLibraryForm = ref(false)

const { showAlert } = useAlert() // useAlert is a composable function that is used to create an alert.It is used to show a success or failure message.

/**
 * usePacbioLibrariesStore is a composable function that is used to access the 'pacbioLibraries' store.
 * It is used to create a new library.
 */
const librariesStore = usePacbioLibrariesStore()

/**
 * library is a computed property that returns the selected sample for which the library is being created.
 * It is used to create a new library and which passed to the PacbioLibraryForm component.
 */
const library = computed(() => {
  return { tag: '', sample: { ...props.selectedSample } }
})

/**
 * @method toggleDisplayCreatePanel
 * @description Toggles the display of the create panel.
 * If isDisplayLibraryForm is true, the create panel is displayed, otherwise displays a 'Create' button.
 */
const toggleDisplayCreatePanel = () => {
  isDisplayLibraryForm.value = !isDisplayLibraryForm.value
}

/**
 * @method createLibrary
 * @description Creates a new library by calling the createLibrary method from the 'pacbioLibraries' store.
 * @returns {void} Displays a success message if the library is created successfully, otherwise displays a failure message.
 */
const createLibrary = async () => {
  const { success, barcode, errors } = await librariesStore.createLibrary(
    formRef?.value?.formLibrary,
  )
  if (success) {
    showAlert('Created library with barcode ' + barcode, 'success')
    toggleDisplayCreatePanel()
  } else {
    showAlert(`Failed to create library in Traction: ${errors}`, 'danger')
  }
}
</script>
