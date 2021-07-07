<template>
  <div data-type="pool-library-edit" class="wrapper flex-wrap">
    <div data-attribute="sample-name" class="sample-name">
      {{ request.sample_name }}
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
  padding: 5px;
}
.wrapper > div {
  // padding: 5px;
  // min-width: 100px;
  // height: 50px;
  // vertical-align: middle;
}
.custom-select,
.sample-name {
  width: 50%;
}
.sample-name {
  text-align: left;
}
.col {
  padding-right: 0;
}
</style>
