<template>
  <div data-type="annotation-list">
    <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
      <div v-for="annotation in annotations" :key="annotation.id">
        <AnnotationItem :annotation="annotation" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import AnnotationItem from '@/components/AnnotationItem.vue'

const props = defineProps({
  annotatableType: {
    type: String,
    required: true,
  },
  annotatableId: {
    type: [String, Number],
    required: true,
  },
})

const pacbioRunCreateStore = usePacbioRunCreateStore()

const annotations = pacbioRunCreateStore.annotationsByAnnotatable({ ...props })
</script>
