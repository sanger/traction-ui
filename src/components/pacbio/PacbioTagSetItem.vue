<template>
<div>
  <div v-if="!isEmpty" data-type="tag-set-item" class="wrapper flex-wrap">
    <div
      v-for="tag in tags"
      :key="tag.id"
      data-attribute="group-id"
      class="border rounded"
      @click="setSelected(tag.id)"
    >
      {{ tag.group_id }}
    </div>
  </div>
   <div>
      <b-alert :show="isEmpty" data-type="warning-message" dismissible variant="danger">
        There is no tag set selected
      </b-alert>
    </div>
</div>
  
</template>

<script>
export default {
  name: 'PacbioTagSetShow',
  data() {
    return {
      selected: [],
    }
  },
  computed: {
    isEmpty() {
      return Object.keys(this.tagSet).length === 0
    },
    tagSet() {
      return this.$store.getters['traction/pacbio/poolCreate/selectedTagSet']
    },
    tags() {
      const tags = this.$store.getters['traction/pacbio/poolCreate/tagList'](this.tagSet.tags)
      console.log(tags)
      return tags
      // return this.$store.getters['traction/pacbio/poolCreate/tagList'](this.tagSet.tags)
    }
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
  width: 100px;
  height: 50px;
  vertical-align: middle;
}
</style>
