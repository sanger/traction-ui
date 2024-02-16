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
import { computed, ref } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries'
import useAlert from '@/composables/useAlert.js'
import useModalHelper from '@/composables/useModalHelper.js'

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
  },
})

// Define refs
const library = ref({ tag: { id: '' }, sample: {} })
const selectedTagSetId = ref('')
const showModal = ref(false)
const modalRef = ref(null)

//Composables
const { showAlert } = useAlert()
const { hideModal } = useModalHelper(modalRef.value)

// Define emits
const emit = defineEmits(['alert'])

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
  const { success, barcode, errors } = await librariesStore.createLibraryInTraction(library.value)
  if (success) {
    hideModal()
    showModal.value = false
    emit('alert', 'Created library with barcode ' + barcode, 'success')
  } else {
    showFailureMessage('create library', errors)
  }
}

const show = () => {
  library.value = { tag: { id: '' }, sample: props.selectedSample }
  showModal.value = true
  selectedTagSetId.value = ''
}
provider()
</script>
