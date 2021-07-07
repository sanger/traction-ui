<template>
  <div data-type="pool-library-edit">
    <div data-attribute="sample-name">
      {{ request.sample_name }}
    </div>
    <b-form-select
      v-if="tagList.length > 0"
      v-model="tag_id"
      data-type="tag-list"
      :options="options"
    ></b-form-select>
  </div>
</template>

<script>
export default {
  name: 'PacbioPoolLibraryEdit',
  props: {
    request: {
      type: Object,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      tag_id: null,
    }
  },
  computed: {
    tagList() {
      return this.$store.getters[
        'traction/pacbio/poolCreate/selectedTagSet'
      ].tags.map(({ id: value, name: text }) => ({ value, text }))
    },
    options() {
      return [{ value: null, text: 'Please select a tag' }, ...this.tagList]
    },
  },
}
</script>
