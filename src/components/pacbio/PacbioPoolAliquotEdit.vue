<template>
  <traction-table-row data-type="pool-library-edit">
    <traction-table-column data-attribute="request-sample-name">
      {{ props.request.sample_name }}
    </traction-table-column>
    <traction-table-column data-attribute="request-source-identifier">
      {{ props.request.source_identifier }}
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
        ></traction-select>
      </traction-field-error>
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="template-prep-kit-box-barcode-error"
        :error="errorsFor('template_prep_kit_box_barcode')"
        :with-icon="isValidationExists('template_prep_kit_box_barcode')"
      >
        <traction-input
          v-model="template_prep_kit_box_barcode"
          data-attribute="template-prep-kit-box-barcode"
          placeholder="Template Prep Kit Box Barcode"
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
import { computed, ref, defineProps } from 'vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'

const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
  request: {
    type: Object,
    default() {
      return { id: null }
    },
  },
  autoTag: {
    type: Boolean,
    default: false,
  },
  // indicates whether the values in this component have been validated
  validated: {
    type: Boolean,
    default: false,
  },
  // function passed from parent indicating what to do when user changes an attribute
  notify: {
    type: Function,
    required: true,
    default: () => {},
  },
})
const fieldsThatRequireValidation = ref([])
const store = usePacbioPoolCreateStore()

const tagList = computed(() => {
  return store.selectedTagSet.tags.map(({ id: value, group_id: text }) => ({ value, text }))
})

const tagListOptions = computed(() => {
  return [{ value: null, text: 'Please select a tag' }, ...tagList.value]
})

const aliquot = computed(() => {
  return store.usedAliquotItem(props.request.id)
})

const librarySetter = (attr) => {
  return computed({
    get() {
      return aliquot.value[attr]
    },
    set(newValue) {
      if (newValue !== aliquot.value[attr]) {
        // record that the attribute has been altered
        fieldsThatRequireValidation.value[attr] = true
        props.notify()
      }
      store.updateLibrary({ source_id: aliquot.value.source_id, [attr]: newValue })
    },
  })
}
const volume = librarySetter('volume')
const insert_size = librarySetter('insert_size')
const concentration = librarySetter('concentration')
const template_prep_kit_box_barcode = librarySetter('template_prep_kit_box_barcode')
const tag_id = computed({
  get() {
    return store.libraryItem(props.request.id).tag_id
  },
  set(tag_id) {
    if (tag_id !== this.tag_id) {
      // record that the tag id has been altered
      fieldsThatRequireValidation.value['tag_id'] = true
      props.notify()
    }
    store.applyTags({
      used_aliquots: { tag_id, source_id: aliquot.value.source_id },
      autoTag: props.autoTag,
    })
  },
})

const errorsFor = (attribute) => {
  if (props.validated) {
    fieldsThatRequireValidation.value = []
  }
  return aliquot.value?.errors?.[attribute]
}

const isValidationExists = (attribute) => {
  if (props.validated) {
    return true
  } else {
    return !fieldsThatRequireValidation.value[attribute]
  }
}
</script>
