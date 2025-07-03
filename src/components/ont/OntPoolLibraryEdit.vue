<template>
  <traction-table-row data-type="pool-library-edit">
    <traction-table-column data-attribute="request-sample-name">
      {{ request.sample_name }}
    </traction-table-column>
    <traction-table-column data-attribute="request-source-identifier">
      {{ request.source_identifier }}
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="tag-id-error"
        :error="errorsFor('tag_id')"
        :with-icon="isValidationExists('tag_id')"
      >
        <traction-select
          v-if="tagList.length > 0"
          v-model="tag_id"
          data-type="tag-list"
          :options="tagListOptions"
          class="tag-id flex w-[110px]"
        ></traction-select>
      </traction-field-error>
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="kit-barcode-error"
        :error="errorsFor('kit_barcode')"
        :with-icon="isValidationExists('kit_barcode')"
      >
        <traction-input
          v-model="kit_barcode"
          data-attribute="kit-barcode"
          placeholder="Kit Barcode"
        />
      </traction-field-error>
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="volume-error"
        :error="errorsFor('volume')"
        :with-icon="isValidationExists('volume')"
      >
        <traction-input v-model="volume" data-attribute="volume" placeholder="Volume" />
      </traction-field-error>
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="concentration-error"
        :error="errorsFor('concentration')"
        :with-icon="isValidationExists('concentration')"
      >
        <traction-input
          v-model="concentration"
          data-attribute="concentration"
          placeholder="Concentration"
        />
      </traction-field-error>
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="insert-size-error"
        :error="errorsFor('insert_size')"
        :with-icon="isValidationExists('insert_size')"
      >
        <traction-input
          v-model="insert_size"
          data-attribute="insert-size"
          placeholder="Insert Size"
        />
      </traction-field-error>
    </traction-table-column>
  </traction-table-row>
</template>

<script setup>
/**
 * # OntPoolLibraryEdit
 *
 * Displays a library from the ont store pool libraries.
 * Uses Pinia ontPoolCreate store for state and actions.
 */
import { computed, ref } from 'vue'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

// Props
const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
  request: {
    type: Object,
    default: () => ({ id: null }),
  },
  autoTag: {
    type: Boolean,
    default: false,
  },
  validated: {
    type: Boolean,
    default: false,
  },
  notify: {
    type: Function,
    default: () => {},
  },
})

// Store
const ontPoolCreateStore = useOntPoolCreateStore()

// Local state
const fieldsThatRequireValidation = ref([])

// Computed: store getters
const selectedTagSet = computed(() => ontPoolCreateStore.selectedTagSet)
const libraryItem = ontPoolCreateStore.libraryItem

// Computed: tag list and options
const tagList = computed(
  () => selectedTagSet.value?.tags?.map(({ id: value, group_id: text }) => ({ value, text })) ?? [],
)
const tagListOptions = computed(() => [
  { value: null, text: 'Please select a tag' },
  ...tagList.value,
])

// Computed: library for this request
const library = computed(() => libraryItem(props.request.id))

// Two-way binding helpers for library fields
function useLibrarySetter(attr) {
  return computed({
    get: () => library.value?.[attr],
    set: (newValue) => {
      if (newValue !== library.value?.[attr]) {
        fieldsThatRequireValidation.value[attr] = true
        props.notify()
      }
      ontPoolCreateStore.updatePoolingLibrary({
        ont_request_id: library.value?.ont_request_id,
        [attr]: newValue,
      })
    },
  })
}

const volume = useLibrarySetter('volume')
const insert_size = useLibrarySetter('insert_size')
const concentration = useLibrarySetter('concentration')
const kit_barcode = useLibrarySetter('kit_barcode')

// Tag ID setter (special logic for tags)
const tag_id = computed({
  get: () => library.value?.tag_id,
  set: (tag_id) => {
    if (tag_id !== tag_id.value) {
      fieldsThatRequireValidation.value['tag_id'] = true
      props.notify()
    }
    ontPoolCreateStore.applyTags(
      { tag_id, ont_request_id: library.value?.ont_request_id },
      props.autoTag,
    )
  },
})

// Methods
function errorsFor(attribute) {
  setValidationRequired()
  return library.value?.errors?.[attribute]
}

function isValidationExists(attribute) {
  if (props.validated) {
    return true
  } else {
    return !fieldsThatRequireValidation.value[attribute]
  }
}

function setValidationRequired() {
  if (props.validated) {
    fieldsThatRequireValidation.value = []
  }
}
</script>
