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
        v-model="tag_id"
        data-type="tag-list"
        :options="tagListOptions"
        @change="update('tag_id')"
      ></b-form-select>
    </b-td>
    <b-td>
      <b-form-input
        v-model="template_prep_kit_box_barcode"
        data-attribute="template-prep-kit-box-barcode"
        :value="template_prep_kit_box_barcode"
        placeholder="Template Prep Kit Box Barcode"
        type="text"
        title="Template Prep Kit Box Barcode"
        class="template-prep-kit-box-barcode"
        @update="update('template_prep_kit_box_barcode')"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="volume"
        data-attribute="volume"
        :value="volume"
        placeholder="Volume"
        type="text"
        title="Volume"
        @update="update('volume')"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="concentration"
        data-attribute="concentration"
        :value="concentration"
        placeholder="Concentration"
        type="text"
        title="Concentration"
        @update="update('concentration')"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="fragment_size"
        data-attribute="fragment_size"
        :value="fragment_size"
        placeholder="Fragment Size"
        type="text"
        title="Fragment Size"
        @update="update('fragment_size')"
      />
    </b-td>
  </b-tr>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('traction/pacbio/poolCreate')
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
        return {}
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
    ...mapGetters(['selectedTagSet']),
    tagList() {
      return this.selectedTagSet.tags.map(({ id: value, group_id: text }) => ({ value, text }))
    },
    tagListOptions() {
      return [{ value: null, text: 'Please select a tag' }, ...this.tagList]
    },
  },
  methods: {
    ...mapMutations(['updateLibrary']),
    update(attribute) {
      this.updateLibrary({ id: this.id, attributes: { [attribute]: this[attribute] } })
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
td, .custom-select, .form-control {
  font-size: 0.9em;
}
.col {
  padding-right: 0;
}
</style>
