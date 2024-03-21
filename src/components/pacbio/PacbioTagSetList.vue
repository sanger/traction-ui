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
          @update:modelValue="updateSelected"
        ></traction-select>
      </div>
    </traction-section>
  </div>
</template>

<script setup>
/**
 * @name PacbioTagSetList
 * @description Renders a list of tag sets
 */
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate'
import { computed } from 'vue'

// composables
const pacbioPoolCreateStore = usePacbioPoolCreateStore()
const rootStore = usePacbioRootStore()
/**
 * Whether the tag set list is empty
 */
const isEmpty = computed(() => rootStore.tagSetList.length === 0)
/**
 * The tag sets to display in the select
 * @type {Array}
 * @example [{ value: 1, text: 'Tag Set 1' }, { value: 2, text: 'Tag Set 2' }]
 */
const tagSets = computed(() =>
  rootStore.tagSetList.map(({ id: value, name: text }) => ({ value, text })),
)
/**
 * The options to display in the select
 * @type {Array}
 */
const options = computed(() => [{ value: null, text: 'Please select a tag set' }, ...tagSets.value])
/**
 * The selected tag set
 */
const selected = computed(() => {
  const { id = null } = rootStore.tagSetList.find(({ selected }) => selected) || {}
  return id
})
/**
 * Updates the selected tag set
 * @param id - The tag set id
 */
const updateSelected = (id) => {
  pacbioPoolCreateStore.selectTagSet(id)
}
</script>
