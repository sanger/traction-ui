<template>
  <traction-tr data-type="pool-library-edit">
    <traction-td data-attribute="request-sample-name">
      {{ request.sample_name }}
    </traction-td>
    <traction-td data-attribute="request-source-identifier">
      {{ request.source_identifier }}
    </traction-td>
    <traction-td>
      <traction-select
        v-if="tagList.length > 0"
        v-model="tag_id"
        data-type="tag-list"
        :options="tagListOptions"
        :state="hasErrors('tag_id')"
        class="tag-id"
      ></traction-select>
    </traction-td>
    <traction-td>
      <traction-field-error
        data-attribute="template-prep-kit-box-barcode-error"
        :error="errorsFor('template_prep_kit_box_barcode')"
        :with-icon="
          attributeValueExists('template_prep_kit_box_barcode') ||
          hasErrors('template_prep_kit_box_barcode')
        "
      >
        <traction-input
          v-model="template_prep_kit_box_barcode"
          data-attribute="template-prep-kit-box-barcode"
          :value="template_prep_kit_box_barcode"
          placeholder="Template Prep Kit Box Barcode"
        />
      </traction-field-error>
    </traction-td>
    <traction-td>
      <traction-field-error
        data-attribute="volume-error"
        :error="errorsFor('volume')"
        :with-icon="attributeValueExists('volume') || hasErrors('volume')"
      >
        <traction-input
          v-model="volume"
          data-attribute="volume"
          :value="volume"
          placeholder="Volume"
        />
      </traction-field-error>
    </traction-td>
    <traction-td>
      <traction-field-error
        data-attribute="concentration-error"
        :error="errorsFor('concentration')"
        :with-icon="attributeValueExists('concentration') || hasErrors('concentration')"
      >
        <traction-input
          v-model="concentration"
          data-attribute="concentration"
          :value="concentration"
          placeholder="Concentration"
        />
      </traction-field-error>
    </traction-td>
    <traction-td>
      <traction-field-error
        data-attribute="insert-size-error"
        :error="errorsFor('insert_size')"
        :with-icon="attributeValueExists('insert_size') || hasErrors('insert_size')"
      >
        <traction-input
          v-model="insert_size"
          data-attribute="insert-size"
          :value="insert_size"
          placeholder="Insert Size"
        />
      </traction-field-error>
    </traction-td>
  </traction-tr>
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
  },
  data() {
    return {}
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
    hasErrors(attribute) {
      if (!this.library.errors) {
        return false
      }
      return this.library.errors[attribute].length > 0
    },
    errorsFor(attribute) {
      return this.library.errors && this.library.errors[attribute]
    },
    attributeValueExists(attribute) {
      return this.library[attribute] && this.library[attribute].length > 0
    },
  },
}
</script>

<style scoped lang="scss">
td,
.custom-select,
.form-control {
  font-size: 0.8em;
}
.tag-id {
  width: 110px;
}
</style>
