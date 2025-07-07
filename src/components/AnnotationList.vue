<template>
  <div data-type="annotation-list">
    <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
      <div v-for="annotation in annotations" :key="annotation.id">
        <AnnotationItem :annotation="annotation" />
      </div>
    </div>
  </div>
  <traction-button data-action="add-annotation" theme="create" @click="addAnnotation()"
    >+</traction-button
  >
</template>

<script setup>
import AnnotationItem from '@/components/AnnotationItem.vue'
import { annotationsByAnnotatable } from '@/stores/utilities/annotation.js'
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
  annotations: {
    type: Array,
    default: () => [],
  },
})

const annotations = reactive(annotationsByAnnotatable({ ...props }))

const addAnnotation = () => annotations.push({})
</script>
