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
      ></b-form-select>
      <b-form-invalid-feedback :state="!!library.errors.tag_id" data-attribute="tag-id-error">
        {{ library.errors.tag_id }}
      </b-form-invalid-feedback>
    </b-td>
    <b-td>
      <b-form-input
        v-model="library.template_prep_kit_box_barcode"
        data-attribute="template-prep-kit-box-barcode"
        :value="template_prep_kit_box_barcode"
        placeholder="Template Prep Kit Box Barcode"
        type="text"
        title="Template Prep Kit Box Barcode"
        class="template-prep-kit-box-barcode"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="library.volume"
        data-attribute="volume"
        :value="volume"
        placeholder="Volume"
        type="text"
        title="Volume"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="library.concentration"
        data-attribute="concentration"
        :value="concentration"
        placeholder="Concentration"
        type="text"
        title="Concentration"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="library.fragment_size"
        data-attribute="fragment-size"
        :value="fragment_size"
        placeholder="Fragment Size"
        type="text"
        title="Fragment Size"
      />
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
    return {
      tag_id: null,
      template_prep_kit_box_barcode: null,
      volume: null,
      concentration: null,
      fragment_size: null,
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
