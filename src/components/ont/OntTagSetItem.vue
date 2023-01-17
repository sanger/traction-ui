<template>
  <div class="px-4">
    <details v-if="selectedTagSet.id" class="tag-set-item mt-2">
      <summary data-attribute="tag-set-name" class="tag-set-name">
        {{ tagSetName }}
        <traction-tag class="bg-sp rounded-md text-white text-sm ml-2 px-2 py-1"
          >{{ tagCount }} tags</traction-tag
        >
      </summary>
      <div data-type="tag-set-item" class="flex flex-wrap p-4">
        <div
          v-for="tag in selectedTagSet.tags"
          :key="tag.id"
          data-attribute="group-id"
          class="flex items-center p-4 border bg-sdb-300 text-white text-sm rounded-md"
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
const { mapGetters } = createNamespacedHelpers('traction/ont/pools')
/**
 * # OntTagSetItem
 *
 * Displays a single tag that is present in the ont store selected tagset
 */
export default {
  name: 'OntTagSetItem',
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
