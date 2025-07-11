<template>
  <div data-type="annotation-list">
    <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
      <div v-for="annotation in annotations" :key="annotation.id">
        <AnnotationItem
          :id="annotation.id"
          :parent="props.parent"
          :annotation-type-select-options="selectOptions"
        />
      </div>
    </div>
  </div>
  <traction-button data-action="add-annotation" theme="create" @click="addAnnotation()"
    >+</traction-button
  >
</template>

<script setup>
import AnnotationItem from '@/components/AnnotationItem.vue'
import { annotationTypeSelectOptions, AnnotationItemType } from '@/stores/utilities/annotation.js'
import { computed } from 'vue'

const props = defineProps({
  /**
   * The parent object to which the annotations belong.
   * This could be a run, or any other resource that supports annotations.
   * It will be part of the store.
   * @type {Object}
   * @required
   */
  parent: {
    type: Object,
    required: true,
  },
  /**
   * The list of annotation types available for selection.
   * This is used to populate the select options for each annotation.
   * @type {Array}
   * @required
   */
  annotationTypes: {
    type: Array,
    required: true,
  },
})

const selectOptions = annotationTypeSelectOptions(props.annotationTypes)

const annotations = computed(() => props.parent.annotations)

const addAnnotation = () => {
  const id = crypto.randomUUID()
  annotations.value.push(AnnotationItemType({ id, newRecord: true }))
}
</script>
