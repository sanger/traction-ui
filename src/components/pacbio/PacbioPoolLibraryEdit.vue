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
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  'traction/pacbio/poolCreate',
)
const librarySetter = (attr) => {
  return {
    get() {
      return this.library[attr]
    },
    set(newValue) {
      if (newValue !== this.library[attr]) {
        // record that the attribute has been altered
        this.fieldsThatRequireValidation[attr] = true
        this.notify()
      }
      this.updateLibrary({ pacbio_request_id: this.library.pacbio_request_id, [attr]: newValue })
    },
  }
}
export default {
  name: 'PacbioPoolLibraryEdit',
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
  },
  data() {
    return {
      // This is an array holding attribute names that have been changed and require validation
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
    template_prep_kit_box_barcode: librarySetter('template_prep_kit_box_barcode'),
    tag_id: {
      get() {
        return this.library.tag_id
      },
      set(tag_id) {
        if (tag_id !== this.tag_id) {
          // record that the tag id has been altered
          this.fieldsThatRequireValidation['tag_id'] = true
          this.notify()
        }
        this.applyTags({
          library: { tag_id, pacbio_request_id: this.library.pacbio_request_id },
          autoTag: this.autoTag,
        })
      },
    },
  },
  methods: {
    ...mapMutations(['updateLibrary']),
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
    // method used to decide the state of the valid/invalid flag on the field
    isValidationExists(attribute) {
      if (this.validated) {
        return true
      } else {
        // red cross for invalid or null for no flag if changed
        return !this.fieldsThatRequireValidation[attribute]
      }
    },
    setValidationRequired() {
      if (this.validated) {
        // The parent component has validated the attributes, so we can clear
        // the outstanding list of attributes that require validation
        this.fieldsThatRequireValidation = []
      }
    },
  },
}
</script>
