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
      <traction-invalid-feedback data-attribute="tag-id-error">
        {{ errorsFor('tag_id') }}
      </traction-invalid-feedback>
    </traction-td>
    <traction-td>
      <traction-input
        v-model="template_prep_kit_box_barcode"
        data-attribute="template-prep-kit-box-barcode"
        :value="template_prep_kit_box_barcode"
        placeholder="Template Prep Kit Box Barcode"
        type="text"
        title="Template Prep Kit Box Barcode"
        :state="hasErrors('template_prep_kit_box_barcode')"
      />
      <traction-invalid-feedback data-attribute="template-prep-kit-box-barcode-error">
        {{ errorsFor('template_prep_kit_box_barcode') }}
      </traction-invalid-feedback>
    </traction-td>
    <traction-td>
      <traction-input
        v-model="volume"
        data-attribute="volume"
        :value="volume"
        placeholder="Volume"
        type="text"
        title="Volume"
        :state="hasErrors('volume')"
      />
      <traction-invalid-feedback data-attribute="volume-error">
        {{ errorsFor('volume') }}
      </traction-invalid-feedback>
    </traction-td>
    <traction-td>
      <traction-input
        v-model="concentration"
        data-attribute="concentration"
        :value="concentration"
        placeholder="Concentration"
        type="text"
        title="Concentration"
        :state="hasErrors('concentration')"
      />
      <traction-invalid-feedback data-attribute="concentration-error">
        {{ errorsFor('concentration') }}
      </traction-invalid-feedback>
    </traction-td>
    <traction-td>
      <traction-input
        v-model="insert_size"
        data-attribute="insert-size"
        :value="insert_size"
        placeholder="Insert Size"
        type="text"
        title="Insert Size"
        :state="hasErrors('insert_size')"
      />
      <traction-invalid-feedback data-attribute="insert-size-error">
        {{ errorsFor('insert_size') }}
      </traction-invalid-feedback>
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
        return null
      }
      return !this.library.errors[attribute]
    },
    errorsFor(attribute) {
      return this.library.errors && this.library.errors[attribute]
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
