<template>
  <b-col class="tag-set-item">
    <div data-attribute="tag-set-name" class="tag-set-name">
      <h3>{{ tagSetName }}</h3>
    </div>
    <div v-if="!isEmpty" data-type="tag-set-item" class="wrapper flex-wrap">
      <div
        v-for="tag in selectedTagSet.tags"
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
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioTagSetShow',
  data() {
    return {
      selected: [],
    }
  },
  computed: {
    ...mapGetters(['selectedTagSet']),
    isEmpty() {
      return this.selectedTagSet.tags.length === 0
    },
    tagSetName() {
      return this.selectedTagSet.name || 'No tag set selected'
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
@import 'src/styles/components.scss';
.wrapper {
  display: flex;
}
.wrapper > div {
  padding: 5px;
  min-width: 100px;
  margin: 2px;
  height: 50px;
  vertical-align: middle;
}
.tag-set-item {
  padding-bottom: 10px;
}
.tag-set-name {
  text-align: left;
}
</style>
