<template>
  <b-tr data-type="pool-library-edit">
    <b-td data-attribute="request-sample-name">
      {{ request.sample_name }}
    </b-td>
    <b-td data-attribute="request-source-identifier">
      {{ request.source_identifier }}
    </b-td>
    <b-td>
      <b-form-select
        v-if="tagList.length > 0"
        v-model="library.tag_id"
        data-type="tag-list"
        :options="tagListOptions"
        :state="!library.errors.tag_id"
      ></b-form-select>
      <b-form-invalid-feedback data-attribute="tag-id-error">
        {{ library.errors.tag_id }}
      </b-form-invalid-feedback>
    </b-td>
    <b-td>
      <b-form-input
        v-model="library.template_prep_kit_box_barcode"
        data-attribute="template-prep-kit-box-barcode"
        :value="library.template_prep_kit_box_barcode"
        placeholder="Template Prep Kit Box Barcode"
        type="text"
        title="Template Prep Kit Box Barcode"
        class="template-prep-kit-box-barcode"
        :state="!library.errors.template_prep_kit_box_barcode"
      />
      <b-form-invalid-feedback data-attribute="template-prep-kit-box-barcode-error">
        {{ library.errors.template_prep_kit_box_barcode }}
      </b-form-invalid-feedback>
    </b-td>
    <b-td>
      <b-form-input
        v-model="library.volume"
        data-attribute="volume"
        :value="library.volume"
        placeholder="Volume"
        type="text"
        title="Volume"
        :state="!library.errors.volume"
      />
      <b-form-invalid-feedback data-attribute="volume-error">
        {{ library.errors.volume }}
      </b-form-invalid-feedback>
    </b-td>
    <b-td>
      <b-form-input
        v-model="library.concentration"
        data-attribute="concentration"
        :value="library.concentration"
        placeholder="Concentration"
        type="text"
        title="Concentration"
        :state="!library.errors.concentration"
      />
      <b-form-invalid-feedback data-attribute="concentration-error">
        {{ library.errors.concentration }}
      </b-form-invalid-feedback>
    </b-td>
    <b-td>
      <b-form-input
        v-model="library.fragment_size"
        data-attribute="fragment-size"
        :value="library.fragment_size"
        placeholder="Fragment Size"
        type="text"
        title="Fragment Size"
        :state="!library.errors.fragment_size"
      />
      <b-form-invalid-feedback data-attribute="fragment-size-error">
        {{ library.errors.fragment_size }}
      </b-form-invalid-feedback>
    </b-td>
  </b-tr>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/poolCreate')
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
  },
}
</script>

<style scoped lang="scss">
.custom-select {
  width: auto;
}
.form-control {
  width: 100px;
}
.template-prep-kit-box-barcode {
  width: 150px;
}
td,
.custom-select,
.form-control {
  font-size: 0.9em;
}
.col {
  padding-right: 0;
}
</style>
