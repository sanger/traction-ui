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

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('traction/ont/pools')
const librarySetter = (attr) => {
  return {
    get() {
      return this.library[attr]
    },
    set(newValue) {
      if (newValue !== this.library[attr]) {
        this.fieldsThatRequireValidation[attr] = true
        this.notify()
      }
      this.updatePoolingLibrary({ ont_request_id: this.library.ont_request_id, [attr]: newValue })
    },
  }
}
/**
 * # OntPoolLibraryEdit
 *
 * Displays a library from the ont store pool libraies
 */
export default {
  name: 'OntPoolLibraryEdit',
  props: {
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
    // Indicates whether the values in this component have been validated
    validated: {
      type: Boolean,
      default: false,
    },
    // Parent function indiciated what to do when a user changes an attribute
    notify: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      fieldsThatRequireValidation: [],
    }
  },
  computed: {
    ...mapGetters(['selectedTagSet', 'libraryItem']),
    tagList() {
      return this.selectedTagSet.tags.map(({ id: value, group_id: text }) => ({ value, text }))
    },
    tagListOptions() {
      return [{ value: null, text: 'Please select a tag' }, ...this.tagList]
    },
    library() {
      return this.libraryItem(this.request.id)
    },
    volume: librarySetter('volume'),
    insert_size: librarySetter('insert_size'),
    concentration: librarySetter('concentration'),
    kit_barcode: librarySetter('kit_barcode'),
    tag_id: {
      get() {
        return this.library.tag_id
      },
      set(tag_id) {
        if (tag_id !== this.tag_id) {
          this.fieldsThatRequireValidation['tag_id'] = true
          this.notify()
        }
        this.applyTags({
          library: { tag_id, ont_request_id: this.library.ont_request_id },
          autoTag: this.autoTag,
        })
      },
    },
  },
  methods: {
    ...mapMutations(['updatePoolingLibrary']),
    ...mapActions(['applyTags']),
    //return any errors exist in library for the given attribute
    errorsFor(attribute) {
      this.setValidationRequired()
      return this.library?.errors?.[attribute]
    },
    attributeValueExists(attribute) {
      this.setValidationRequired()
      return this.library?.[attribute]?.length > 0
    },
    isValidationExists(attribute) {
      if (this.validated) {
        return true
      } else {
        return !this.fieldsThatRequireValidation[attribute]
      }
    },
    setValidationRequired() {
      if (this.validated) {
        this.fieldsThatRequireValidation = []
      }
    },
  },
}
</script>
