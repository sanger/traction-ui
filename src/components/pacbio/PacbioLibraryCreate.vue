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
      <traction-form id="libraryCreateModal" @submit="createLibrary" @keydown.enter.prevent>
        <fieldset id="selected-sample" class="py-1">
          <label>The sample selected for this library is:</label>
          <br />
          {{ selectedSample.sample_name }} ({{ selectedSample.source_identifier }})
        </fieldset>

        <fieldset id="tag-set-select-input" class="py-2">
          <label>Tag:</label>
          <traction-select
            id="tag-set-input"
            v-model="selectedTagSetId"
            data-type="tag-set-list"
            :options="tagSetOptions"
            class="mb-3"
            @update:modelValue="resetSelectedTagId"
          ></traction-select>

          <traction-select
            id="tag-input"
            v-model="library.tag.id"
            :options="tagOptions"
            :disabled="!selectedTagSetId"
            class="mb-3"
          />
        </fieldset>

        <fieldset id="input-group-volume" class="py-2">
          <label>Volume:</label>
          <traction-input
            id="library-volume"
            v-model="library.volume"
            type="number"
            min="0"
            step="any"
            placeholder="Example: 1.0"
          >
          </traction-input>
        </fieldset>

        <fieldset id="input-group-concentration" class="py-2">
          <label>Concentration:</label>

          <traction-input
            id="library-concentration"
            v-model="library.concentration"
            type="number"
            min="0"
            step="any"
            placeholder="Example: 1.0"
          >
          </traction-input>
        </fieldset>

        <fieldset id="input-group-templatePrepKitBoxBarcode" class="py-2">
          <label>Template prep kit box barcode:</label>
          <traction-input
            id="library-templatePrepKitBoxBarcode"
            v-model="library.template_prep_kit_box_barcode"
            type="text"
            minlength="21"
            maxlength="21"
            placeholder="Example: 012345678901234567890"
            pattern="\d*"
            inputmode="numeric"
          >
          </traction-input>
        </fieldset>

        <fieldset id="input-group-insertSize" class="py-2">
          <label>Insert size:</label>
          <traction-input
            id="library-insertSize"
            v-model="library.insert_size"
            type="number"
            step="1"
            min="0"
            placeholder="Example: 100"
          >
          </traction-input>
        </fieldset>
      </traction-form>

      <template #modal-footer="{ cancel }">
        <traction-button @click="cancel()"> Cancel </traction-button>

        <traction-button id="create-btn" theme="create" type="submit" form="libraryCreateModal">
          Create
        </traction-button>
      </template>
    </traction-modal>
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
import useModalHelper from '@/composables/useModalHelper.js'

/**
 * defineProps is a Vue 3 function that allows you to define props in the setup function.
 * It is a replacement for the props option in Vue 2.
 * It is used to define props for a component.
 */
const props = defineProps({
  disabled: Boolean, // Boolean value to disable the button
  isStatic: Boolean, // Boolean value to set the modal as static
  selectedSample: { // Object to define the selected sample
    type: Object,
    required: true,
    default() {
      return {}
    },
  },
})

/**
 * ref is a Vue 3 function that allows you to create a reactive object.
 * It is a replacement for the data option in Vue 2.
 * ref() takes the argument and returns it wrapped within a ref object with a .value property:
 * ref(0) returns { value: 0 }
 * To access the value, you use the .value property in setup function, but in the template, you can use the variable directly.
 */
const library = ref({ tag: { id: '' }, sample: {} }) //library is a reactive object that contains the library data, which is used to create a new library.
const selectedTagSetId = ref('') //selectedTagSetId is a reactive object that contains the selected tag set id.
const showModal = ref(false) //showModal is a reactive object that contains the boolean value to show the modal.
const modalRef = ref(null) //modalRef is a reactive object that contains the reference to the modal.

/**
 * Composables are a new Vue 3 feature that allows you to create reusable logic.
 * useAlert and useModalHelper are composable functions that are used to show alerts and hide modals
 */
const { showAlert } = useAlert()
const { hideModal } = useModalHelper(modalRef.value)

/**
 * defineEmits is a new Vue 3 function that allows you to define emits in the setup function.
 * It is a replacement for the emits option in Vue 2.
 * Here it is used to define emits for the alert.
 */
const emit = defineEmits(['alert'])

/**
 * usePacbioLibrariesStore is a composable function that is used to access the pacbio libraries store.
 * This creates a new instance of the pacbio libraries store.
 * It is used to fetch the tag sets and create a new library.
 */
const librariesStore = usePacbioLibrariesStore()

/**
 * computed is a new Vue 3 function that allows you to create a computed property.
 * It is a replacement for the computed option in Vue 2.
 * It is used to create a computed property for the tag set options and tag options.
 */
const tagSetOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag set' }
  return [placeholder, ...librariesStore.tagSetChoices]
})

const tagOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag' }
  return [placeholder, ...librariesStore.tagChoicesForId(selectedTagSetId.value)]
})



/**
 * showFailureMessage is a function that is used to show a failure message when an action fails.
 * @param {*} action String value to define the action
 * @param {*} errors Array of errors
 */
const showFailureMessage = (action, errors) => {
  showAlert(`Failed to ${action} in Traction: ${errors.length > 0 ? errors[0] : ''}`, 'danger')
}

/**
 * provider is an async function that is used to fetch the tag sets from the libraries store.
 * It is used to fetch the tag sets from the libraries store and show a failure message if the action fails.
 * This function is called when the component is created.
 */
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

/**
 * resetSelectedTagId is a function that is used to reset the selected tag id.
 */
const resetSelectedTagId = () => {
  library.value.tag.id = ''
}

/**
 * createLibrary is an async function that is used to create a new library.
 */
const createLibrary = async () => {
  const { success, barcode, errors } = await librariesStore.createLibraryInTraction(library.value)
  if (success) {
    hideModal()
    showModal.value = false
    emit('alert', 'Created library with barcode ' + barcode, 'success')
  } else {
    showFailureMessage('create library', errors)
  }
}

/**
 * show is a function that is used to show the modal.
 */
const show = () => {
  library.value = { tag: { id: '' }, sample: props.selectedSample }
  showModal.value = true
  selectedTagSetId.value = ''
}
provider()
</script>
