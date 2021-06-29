<template>
  <div data-type="tag-list" class="wrapper">
    <div
      v-for="tag in tags"
      :key="tag.id"
      data-attribute="group-id"
      class="border rounded"
      @click="setSelected(tag.id)"
    >
      {{ tag.groupId }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PacbioTagSetShow',
  data() {
    return {
      tagSet: {},
      selected: [],
      tags: {},
    }
  },
  mounted() {
    this.tagSet = this.$store.getters['traction/pacbio/poolCreate/selectedTagSet']
    this.tags = this.$store.getters['traction/pacbio/poolCreate/tagList'](this.tagSet.tags)
  },
  methods: {
    setSelected(id) {
      const index = this.selected.indexOf(id)
      if (index === -1) {
        this.selected.push(id)
      } else {
        this.selected.splice(index, 1)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
}
.wrapper > div {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
</style>
