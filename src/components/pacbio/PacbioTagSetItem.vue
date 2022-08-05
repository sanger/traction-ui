<template>
  <div class="px-4">
    <details v-if="selectedTagSet.id" class="tag-set-item mt-2">
      <summary data-attribute="tag-set-name" class="tag-set-name">
        {{ tagSetName }}
        <b-badge class="bg-sp rounded-md text-white text-sm ml-2 px-2 py-1">{{ tagCount }} tags</b-badge>
      </summary>
      <div data-type="tag-set-item" class="wrapper flex-wrap p-4">
        <div
          v-for="tag in selectedTagSet.tags"
          :key="tag.id"
          data-attribute="group-id"
          class="flex items-center border bg-sdb-300 text-white text-sm rounded-md"
        >
          {{ tag.group_id }}
        </div>
      </div>
    </details>
    <div v-else class="tag-set-item">
      <traction-muted-text data-attribute="tag-set-name-placeholder" class="tag-set-name"
        >No tag set selected</traction-muted-text
      >
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/poolCreate')
export default {
  name: 'PacbioTagSetShow',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['selectedTagSet']),
    tagSetName() {
      return this.selectedTagSet.name
    },
    tagCount() {
      return this.selectedTagSet.tags.length
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
  padding-top: 10px;
}
.tag-set-name {
  text-align: left;
}
</style>
