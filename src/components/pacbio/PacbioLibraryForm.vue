<template>
  <div>
    <traction-form id="librarForm" @keydown.enter.prevent>
      <template v-if="sample">
        <fieldset id="selected-sample" class="py-1">
          <label>The sample selected for this library is:</label>
          <br />
          {{ sample.sample_name }} ({{ sample.source_identifier }})
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
            v-model="formLibrary.tag_id"
            :options="tagOptions"
            :disabled="!selectedTagSetId"
            class="mb-3"
          />
        </fieldset>
      </template>
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
import { computed, ref } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries'
import useAlert from '@/composables/useAlert.js'

// Define props
const props = defineProps({
  library: {
    type: Object,
    default() {
      return { sample: {} }
    },
  },
  sample: {
    type: Object,
    default() {
      return undefined
    },
  },
})

//initialize formLibrary with the library prop
const formLibrary = ref(props.library)
//Expose formLibrary to parent component
defineExpose({
  formLibrary,
})
// Define refs
const selectedTagSetId = ref('')
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

const { showAlert } = useAlert()

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
  formLibrary.value.tag_id = ''
}

provider()
</script>
