<template>
  <traction-section :title="title">
    <div
      :data-list="dataList"
      data-type="annotation-list"
      class="flex flex-row rounded-md justify-between space-x-2 p-2 bg-gray-200"
    >
      <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
        <div v-for="annotation in annotations" :key="annotation.id">
          <AnnotationItem
            :id="annotation.id"
            :parent="props.parent"
            :annotation-type-select-options="selectOptions"
            @remove-annotation="removeAnnotation($event)"
          />
        </div>
      </div>
      <traction-button data-action="add-annotation" theme="create" @click="addAnnotation()">
        +</traction-button
      >
    </div>
  </traction-section>
</template>

<script setup>
import AnnotationItem from '@/components/AnnotationItem.vue'
import { annotationTypeSelectOptions, AnnotationItemType } from '@/stores/utilities/annotation.js'
import { computed } from 'vue'
import { capitalizeFirstLetter, singularise } from '@/lib/stringHumanisation.js'

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

const title = computed(() => {
  return `${singularise(capitalizeFirstLetter(props.parent.type))} Annotations`
})

const dataList = computed(() => {
  return `${singularise(props.parent.type)}-annotations`
})

/**
 * Adds a new annotation to the list.
 * The new annotation will have a unique ID and be marked as a new record.
 * It will be added to the parent object's annotations.
 * @returns {void}
 */
const addAnnotation = () => {
  const id = crypto.randomUUID()
  annotations.value.push(AnnotationItemType({ id, newRecord: true }))
}

/**
 *
 * @param id
 * Removes an annotation from the list by its ID.
 * @returns {void}
 */
const removeAnnotation = (id) => {
  const index = annotations.value.findIndex((annotation) => annotation.id === id)
  if (index !== -1) {
    annotations.value.splice(index, 1)
  }
}
</script>
