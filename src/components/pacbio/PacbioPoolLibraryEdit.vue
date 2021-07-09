<template>
  <div data-type="pool-library-edit" class="wrapper flex-wrap">
    <div data-attribute="request-sample-name">
      {{ request.sample_name }}
    </div>
    <div data-attribute="request-source-identifier">
      {{ request.source_identifier }}
    </div>
    <b-form-select
      v-if="tagList.length > 0"
      v-model="tag_id"
      data-type="tag-list"
      :options="tagListOptions"
    ></b-form-select>
    <b-form-input
      v-model="template_prep_kit_box_barcode"
      data-attribute="template-prep-kit-box-barcode"
      :value="template_prep_kit_box_barcode"
      placeholder="Template Prep Kit Box Barcode"
      type="text"
      title="Template Prep Kit Box Barcode"
      class="template-prep-kit-box-barcode"
    />
    <b-form-input
      v-model="volume"
      data-attribute="volume"
      :value="volume"
      placeholder="Volume"
      type="text"
      title="Volume"
    />
    <b-form-input
      v-model="concentration"
      data-attribute="concentration"
      :value="concentration"
      placeholder="Concentration"
      type="text"
      title="Concentration"
    />
     <b-form-input
      v-model="fragment_size"
      data-attribute="fragment_size"
      :value="fragment_size"
      placeholder="Fragment Size"
      type="text"
      title="Fragment Size"
    />
  </div>
</template>

<script>
export default {
  name: 'PacbioPoolLibraryEdit',
  props: {
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
      fragment_size: null
    }
  },
  computed: {
    tagList() {
      return this.$store.getters[
        'traction/pacbio/poolCreate/selectedTagSet'
      ].tags.map(({ id: value, group_id: text }) => ({ value, text }))
    },
    tagListOptions() {
      return [{ value: null, text: 'Please select a tag' }, ...this.tagList]
    },
  },
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
}
.wrapper:not(:last-child) {
  border-bottom: 1px dashed;
}
.wrapper > div {
  text-align: left;
}
.custom-select {
  width: auto;
} 
.form-control {
  width: 100px;
}
.template-prep-kit-box-barcode {
  width: 125px;
}

.col {
  padding-right: 0;
}
</style>
