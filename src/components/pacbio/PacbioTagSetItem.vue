<template>
  <div class="px-4">
    <details v-if="selectedTagSet.id" class="pt-2 pb-2 mt-2">
      <summary data-attribute="tag-set-name" class="text-left">
        {{ selectedTagSet.name }}
        <traction-tag class="bg-sp rounded-md text-white text-sm ml-2 px-2 py-1"
          >{{ selectedTagSet.tags.length }} tags</traction-tag
        >
      </summary>
      <div data-type="tag-set-item" class="flex flex-wrap p-4">
        <div
          v-for="tag in selectedTagSet.tags"
          :key="tag.id"
          data-attribute="group-id"
          class="flex items-center border bg-sdb-300 text-white text-sm rounded-md px-1 py-4 m-1"
        >
          {{ tag.group_id }}
        </div>
      </div>
    </details>
    <div v-else class="pt-2 pb-2">
      <traction-muted-text data-attribute="tag-set-name-placeholder" class="text-left"
        >No tag set selected</traction-muted-text
      >
    </div>
  </div>
</template>

<script setup>
/**
 * @name PacbioTagSetItem
 * @description Renders a tag set item
 */
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate'
import { computed } from 'vue'

const store = usePacbioPoolCreateStore()
const selectedTagSet = computed(() => store.selectedTagSet)
</script>
