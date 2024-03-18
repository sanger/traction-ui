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
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate'
import { computed } from 'vue'

const pacbioPoolCreateStore = usePacbioPoolCreateStore()
const rootStore = usePacbioRootStore()
const isEmpty = computed(() => rootStore.tagSetList.length === 0)
const tagSets = computed(() =>
  rootStore.tagSetList.map(({ id: value, name: text }) => ({ value, text })),
)
const options = computed(() => [{ value: null, text: 'Please select a tag set' }, ...tagSets.value])
const selected = computed(() => {
  const { id = null } = rootStore.tagSetList.find(({ selected }) => selected) || {}
  return id
})
const updateSelected = (id) => {
  pacbioPoolCreateStore.selectTagSet(id)
}
</script>
