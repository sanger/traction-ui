<template>
  <div class="tag-set-list">
    <traction-section number="3" title="Tag Selection">
      <div class="text-left">
        Select tag set
        <traction-select
          v-if="!isEmpty"
          :model-value="selected"
          data-type="tag-set-list"
          :options="options"
          @update:model-value="updateSelected"
        ></traction-select>
      </div>
    </traction-section>
  </div>
</template>

<script setup>
/**
 * # OntTagSetList
 *
 * Displays a list of tagSets to select from for ont pooling
 */
import { computed } from 'vue'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js' // <-- Create/use this Pinia store

const ontPoolCreateStore = useOntPoolCreateStore()

const isEmpty = computed(() => ontPoolCreateStore.tagSetList.length === 0)

const tagSets = computed(() =>
  ontPoolCreateStore.tagSetList.map(({ id: value, name: text }) => ({ value, text })),
)

const options = computed(() => [{ value: null, text: 'Please select a tag set' }, ...tagSets.value])

const selected = computed(() => {
  const selectedTagSetId = ontPoolCreateStore.selectedTagSet?.id
  const tagSet = ontPoolCreateStore.tagSetList.find((tagSet) => tagSet.id === selectedTagSetId)
  return tagSet ? tagSet.id : null
})

const updateSelected = (id) => {
  ontPoolCreateStore.selectTagSet(id)
}
</script>
