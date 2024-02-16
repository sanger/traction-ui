<template>
  <div>
    <traction-form id="librarForm" @keydown.enter.prevent>
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
          v-model="formLibrary.tag_id"
          :options="tagOptions"
          :disabled="!selectedTagSetId"
          class="mb-3"
        />
      </fieldset>
      <fieldset id="input-group-volume" class="py-2">
        <label>Volume:</label>
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

      <fieldset id="input-group-concentration" class="py-2">
        <label>Concentration:</label>

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

      <fieldset id="input-group-templatePrepKitBoxBarcode" class="py-2">
        <label>Template prep kit box barcode:</label>
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

      <fieldset id="input-group-insertSize" class="py-2">
        <label>Insert size:</label>
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
/***
 * PacbioLibraryForm component can be used to create or edit a library.
 * @param {Object} library - The library to be  edited or created
 */
import { computed, ref } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries'
import useAlert from '@/composables/useAlert.js'

// Define props
const props = defineProps({
  // The library to be edited or created
  library: {
    type: Object,
    required: true,
    default() {
      return { tag: '', sample: {} }
    },
  },
})

//Create Pinia store
const librariesStore = usePacbioLibrariesStore()

/**
 * Get the tagset for the given library tag, if any
 */
const getTagset = () => {
  const tagSet = props.library.tag ? librariesStore.tagsetForTagId(props.library.tag) : ''
  return tagSet ? tagSet.id : ''
}

/*
selectedTagSetId is a reactive variable, so it will update when the library prop changes
Initialize  selectedTagSetId with the tagset id of the library prop
*/
const selectedTagSetId = ref(getTagset())

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
tagSetOptions is a computed variable, so it will update when the librariesStore.tagSetChoices changes
*/
const tagSetOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag set' }
  return [placeholder, ...librariesStore.tagSetChoices]
})
/*
tagOptions is a computed variable, so it will update when the librariesStore.tagChoicesForId(selectedTagSetId.value) changes
*/
const tagOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag' }
  return [placeholder, ...librariesStore.tagChoicesForId(selectedTagSetId.value)]
})
const { showAlert } = useAlert()


/**
 * Show a failure message
 * @param {string} action - The action that failed
 * @param {Array} errors - The errors that caused the failure
 */
const showFailureMessage = (action, errors) => {
  showAlert(`Failed to ${action} in Traction: ${errors.length > 0 ? errors[0] : ''}`, 'danger')
}

/**
 * Define provider method to fetch tagsets, which is called when the component is created
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
 * Reset the selected tag id
 */
const resetSelectedTagId = () => {
  formLibrary.value.tag_id = ''
}

provider()
</script>
