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
  align-items: stretch;
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
.col {
  padding-right: 0;
}
</style>
