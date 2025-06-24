<template>
  <div data-type="annotation-list">
    <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
      <div v-for="annotation in annotations" :key="annotation.id">
        <AnnotationItem :annotation="annotation" />
      </div>
    </div>
  </div>
  <traction-button data-action="add-annotation" theme="create" @click="addAnnotation(row)"
    >+</traction-button
  >
</template>

<script setup>
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import AnnotationItem from '@/components/AnnotationItem.vue'
import { reactive } from 'vue'

const props = defineProps({
  annotatableType: {
    type: String,
    default: '',
  },
  annotatableId: {
    type: [String, Number],
    default: '',
  },
})

const pacbioRunCreateStore = usePacbioRunCreateStore()

const annotations = reactive(pacbioRunCreateStore.annotationsByAnnotatable({ ...props }))

const addAnnotation = () => annotations.push({})
</script>
