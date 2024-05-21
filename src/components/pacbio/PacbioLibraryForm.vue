<template>
  <div>
    <traction-form
      id="libraryForm"
      class="flex flex-row rounded-md justify-between space-x-2 p-2 bg-gray-200"
      @keydown.enter.prevent
    >
      <fieldset id="tag-set-select-input">
        <traction-label class="ml-1">Tag set</traction-label>
        <traction-field-error
          data-attribute="tag-set-error"
          :error="libraryErrorsFor('tag_set')"
          :with-icon="!!library.errors?.tag_set"
        >
          <traction-select
            id="tag-set-input"
            v-model="selectedTagSetId"
            data-type="tag-set-list"
            :options="tagSetOptions"
            @update:model-value="resetSelectedTagId"
          />
        </traction-field-error>
      </fieldset>

      <fieldset id="tag-select-input">
        <traction-label class="ml-1">Tag</traction-label>
        <traction-field-error
          data-attribute="tag-error"
          :error="libraryErrorsFor('tag')"
          :with-icon="!!library.errors?.tag"
        >
          <traction-select
            id="tag-input"
            v-model="formLibrary.tag_id"
            :options="tagOptions"
            :disabled="!selectedTagSetId"
          />
        </traction-field-error>
      </fieldset>

      <flagged-feature name="dpl_1070_check_primary_aliquot_library_volume">
        <fieldset id="input-group-volume">
          <div class="relative flex flex-row">
            <traction-label class="ml-1 w-full">Initial Volume</traction-label>
            <traction-tooltip
              v-if="formLibrary.used_volume != null"
              :tooltip-text="'Used volume is ' + formLibrary.used_volume"
            >
              <traction-badge id="library-used-volume" colour="sanger-yellow"
                ><TractionInfoIcon class="mr-2" />{{ formLibrary.used_volume }}</traction-badge
              >
            </traction-tooltip>
          </div>
          <traction-field-error
            data-attribute="volume-error"
            :error="formLibrary.error"
            :with-icon="formLibrary.error?.length > 0"
          >
            <traction-input
              id="library-volume"
              v-model="formLibrary.volume"
              type="number"
              :min="formLibrary.used_volume"
              step="any"
              placeholder="Example: 1.0"
              :class="formLibrary.volume < formLibrary.used_volume"
              class="w-full"
              @update:model-value="errorForVolume"
            >
            </traction-input>
          </traction-field-error>
        </fieldset>
        <template #disabled
          ><fieldset id="input-group-volume">
            <traction-label class="ml-1 w-full">Volume</traction-label>
            <traction-input
              id="library-volume"
              v-model="formLibrary.volume"
              type="number"
              step="any"
              placeholder="Example: 1.0"
              :class="inputBorderClass('volume')"
              class="w-full"
            >
            </traction-input></fieldset
        ></template>
      </flagged-feature>

      <fieldset id="input-group-concentration">
        <traction-label class="ml-1">Concentration</traction-label>
        <traction-field-error
          data-attribute="concentration-error"
          :error="libraryErrorsFor('concentration')"
          :with-icon="!!library.errors?.concentration"
        >
          <traction-input
            id="library-concentration"
            v-model="formLibrary.concentration"
            data-attribute="concentration"
            :class="inputBorderClass('concentration')"
          />
        </traction-field-error>
      </fieldset>

      <fieldset id="input-group-templatePrepKitBoxBarcode">
        <traction-label class="ml-1 whitespace-nowrap">Template prep kit box barcode</traction-label>
        <traction-field-error
          data-attribute="template-prep-kit-box-barcode-error"
          :error="libraryErrorsFor('template_prep_kit_box_barcode')"
          :with-icon="!!library.errors?.template_prep_kit_box_barcode"
        >
          <traction-input
            id="library-templatePrepKitBoxBarcode"
            v-model="formLibrary.template_prep_kit_box_barcode"
            data-attribute="template-prep-kit-box-barcode"
            :class="inputBorderClass('template_prep_kit_box_barcode')"
          />
        </traction-field-error>
      </fieldset>

      <fieldset id="input-group-insertSize">
        <traction-label class="ml-1">Insert size</traction-label>
        <traction-field-error
          data-attribute="insert-size-error"
          :error="libraryErrorsFor('insert_size')"
          :with-icon="!!library.errors?.insert_size"
        >
          <traction-input
            id="library-insertSize"
            v-model="formLibrary.insert_size"
            data-attribute="insert-size"
          />
        </traction-field-error>
      </fieldset>
    </traction-form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import useAlert from '@/composables/useAlert.js'
import TractionBadge from '@/components/shared/TractionBadge.vue'
import TractionInfoIcon from '@/components/shared/icons/TractionInfoIcon.vue'
import TractionTooltip from '@/components/shared/TractionTooltip.vue'

// useAlert is a composable function that is used to create an alert.
const { showAlert } = useAlert()

// usePacbioRootStore is a Pinia composable function that returns the pacbio root store.
const pacbioRootStore = usePacbioRootStore()

// Define props
const props = defineProps({
  library: {
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
defineExpose({ formLibrary })

const selectedTagSetId = ref('')

const tagSetOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag set' }
  return [placeholder, ...pacbioRootStore.tagSetChoices]
})

const tagOptions = computed(() => {
  const placeholder = { value: '', text: 'Please select a tag' }
  return [placeholder, ...pacbioRootStore.tagChoicesForId(selectedTagSetId.value)]
})
/**
 * @method errorForVolume
 * Sets the error message for the formLibrary if the volume is less than the used volume.
 * If the volume is not less than the used volume, it clears the error message.
 */
const errorForVolume = () => {
  formLibrary.value.error =
    formLibrary.value.volume < formLibrary.value.used_volume
      ? 'Volume cannot be less than used volume'
      : ''
}

const provider = async () => {
  try {
    const { success, errors } = await pacbioRootStore.fetchPacbioTagSets()
    if (success) {
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

const resetSelectedTagId = () => {
  formLibrary.value.tag_id = ''
}

const libraryErrorsFor = (attribute) => {
  if (formLibrary.value?.[attribute]?.length) {
    delete formLibrary.value?.errors?.[attribute]
    return ''
  }
  return formLibrary.value?.errors?.[attribute]
}

const inputBorderClass = (attribute) => {
  return formLibrary.value[attribute] ? 'rounded-border' : 'rounded-border red-border';
}
</script>

<style scoped>
.rounded-border {
  border-radius: 0.46rem;
  border-width: 1px;
}

.red-border {
  border-color: #f00;
}
</style>
