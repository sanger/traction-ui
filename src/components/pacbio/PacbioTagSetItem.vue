<template>
  <b-col class="tag-set-item">
    <div data-attribute="tag-set-name" class="tag-set-name">
      {{ tagSetName }}
    </div>
    <div v-if="!isEmpty" data-type="tag-set-item" class="wrapper flex-wrap">
      <div
        v-for="tag in tagSet.tags"
        :key="tag.id"
        data-attribute="group-id"
        class="border rounded"
        @click="setSelected(tag.id)"
      >
        {{ tag.group_id }}
      </div>
    </div>
  </b-col>
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
    tagSetName() {
      return this.tagSet.name || 'No tag set selected'
    },
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
  padding: 5px;
  min-width: 100px;
  height: 50px;
  vertical-align: middle;
}
.tag-set-item {
  padding-bottom: 10px;
}
.tag-set-name {
  text-align: left;
}
.col {
  padding-right: 0;
}
</style>
