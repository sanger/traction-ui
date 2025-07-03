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

<script setup>
/**
 * # OntTagSetItem
 *
 * Displays a single tag that is present in the ont store selected tagset.
 * Uses the Pinia ontPoolCreate store for state.
 */
import { computed } from 'vue'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const ontPoolCreateStore = useOntPoolCreateStore()

const selectedTagSet = computed(() => ontPoolCreateStore.selectedTagSet)
const tagSetName = computed(() => selectedTagSet.value?.name)
const tagCount = computed(() => selectedTagSet.value?.tags?.length ?? 0)
</script>
