<template>
  <div>
    <traction-form
      id="libraryForm"
      class="flex flex-row rounded-md justify-between space-x-2 p-2 bg-gray-200"
      @keydown.enter.prevent
    >
      <fieldset id="tag-set-select-input">
        <traction-label class="ml-1">Tag set</traction-label>
        <traction-select
          id="tag-set-input"
          v-model="selectedTagSetId"
          data-type="tag-set-list"
          :options="tagSetOptions"
          @update:model-value="resetSelectedTagId"
        ></traction-select>
      </fieldset>

      <fieldset id="tag-select-input">
        <traction-label class="ml-1">Tag</traction-label>
        <traction-select
          id="tag-input"
          v-model="formLibrary.tag_id"
          :options="tagOptions"
          :disabled="!selectedTagSetId"
        />
      </fieldset>
      <fieldset id="input-group-volume">
        <traction-label class="ml-1">Volume</traction-label>
        <traction-input
          id="library-volume"
          v-model="formLibrary.volume"
          type="number"
          min="0"
          step="any"
          placeholder="Example: 1.0"
        >
        </traction-input>
      </fieldset>

      <fieldset id="input-group-concentration">
        <traction-label class="ml-1">Concentration</traction-label>

        <traction-input
          id="library-concentration"
          v-model="formLibrary.concentration"
          type="number"
          min="0"
          step="any"
          placeholder="Example: 1.0"
        >
        </traction-input>
      </fieldset>

      <fieldset id="input-group-templatePrepKitBoxBarcode">
        <traction-label class="ml-1 whitespace-nowrap"
          >Template prep kit box barcode</traction-label
        >
        <traction-input
          id="library-templatePrepKitBoxBarcode"
          v-model="formLibrary.template_prep_kit_box_barcode"
          type="text"
          minlength="21"
          maxlength="21"
          placeholder="Example: 012345678901234567890"
          pattern="\d*"
          inputmode="numeric"
        >
        </traction-input>
      </fieldset>

      <fieldset id="input-group-insertSize">
        <traction-label class="ml-1">Insert size</traction-label>
        <traction-input
          id="library-insertSize"
          v-model="formLibrary.insert_size"
          type="number"
          step="1"
          min="0"
          placeholder="Example: 100"
        >
        </traction-input>
      </fieldset>
    </traction-form>
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
* defineExpose: is a Vue 3 function that allows you to expose properties to parent components.
 * {@link} https://vuejs.org/api/sfc-script-setup.html#defineexpose
 *  */

/***
 * PacbioLibraryForm component can be used to create or edit a library.
 * @param {Object} library - The library to be  edited or created
 */
import { computed, ref } from 'vue'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import useAlert from '@/composables/useAlert.js'

// useAlert is a composable function that is used to create an alert.It is used to show a success or failure message.
const { showAlert } = useAlert()

// usePacbioRootStore is a Pinia composable function that returns the pacbio root store
const pacbioRootStore = usePacbioRootStore()

// Define props
const props = defineProps({
  library: {
    // The library to be edited or created
    type: Object,
    required: true,
    default() {
      return { tag_id: '', sample: {} }
    },
  },
})

/*
formLibrary is a reactive variable, so it will update when the library prop changes
initialize formLibrary with the library prop
*/
const formLibrary = ref(props.library ? { ...props.library } : {})

/*
Expose formLibrary to parent component as a reactive variable,
so that the parent component can access the formLibrary and its properties
*/
defineExpose({
  formLibrary,
})

/*
selectedTagSetId is a reactive variable, so it will be initialised with an empty string 
This will be updated When the component is created with a library having tag_id or when the user selects a tag set
*/
const selectedTagSetId = ref('')

/**
 * @name tagSetOptions
 * @type {<Array<Object>>}
 * @description A computed property that returns an array of tag set options for a select input.
 * The first option is a placeholder with a value of an empty string and a text of 'Please select a tag set'.
 * The remaining options are the tag set choices from the 'librariesStore'.
 */
const tagSetOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag set' }
  return [placeholder, ...pacbioRootStore.tagSetChoices]
})

/**
 * @name tagOptions
 * @type {<Array<Object>>}
 * @description A computed property that returns an array of tag options for a select input.
 * The first option is a placeholder with a value of an empty string and a text of 'Please select a tag'.
 * The remaining options are the tag choices from the 'librariesStore' for the currently selected tag set ID.
 */
const tagOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag' }
  return [placeholder, ...pacbioRootStore.tagChoicesForId(selectedTagSetId.value)]
})

/**
 * @method provider
 * Fetches the pacbio tag sets from the 'pacbioLibraries' store.
 * If the fetch is successful, it sets the selected tag set ID to the tag set ID of the library.
 * If the fetch is not successful, it shows shows a failure message.
 */
const provider = async () => {
  try {
    const { success, errors } = await pacbioRootStore.fetchPacbioTagSets()
    if (success) {
      // If the library has a tag_id, set the selected tag set ID to the tag set ID of the library
      const tagSet = props.library.tag_id
        ? pacbioRootStore.tagsetForTagId(props.library.tag_id)
        : ''
      selectedTagSetId.value = tagSet ? tagSet.id : ''
    } else {
      showAlert(`Failed to find tags in Traction: ${errors}`, 'danger')
    }
  } catch (error) {
    showAlert(`Failed to find tags in Traction: ${error}`, 'danger')
  }
}

provider()
/**
 * @method resetSelectedTagId
 * Resets the selected tag ID to an empty string.
 */
const resetSelectedTagId = () => {
  formLibrary.value.tag_id = ''
}
</script>
