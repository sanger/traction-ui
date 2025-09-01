<template>
  <div>
    <traction-heading level="4" show-border>{{ title }}</traction-heading>
    <div
      :data-list="dataList"
      data-type="annotation-list"
      class="w-full rounded-md p-4 bg-gray-100"
    >
      <!-- Header row -->
      <div class="flex w-full">
        <div class="w-5/6">
          <div :class="`grid w-full items-start text-left pb-2 grid-cols-3 font-bold gap-x-2`">
            <traction-label>Comment</traction-label>
            <traction-label>User</traction-label>
            <traction-label>Type</traction-label>
          </div>
        </div>
        <div class="w-1/6 flex justify-end">
          <traction-button
            v-if="!annotations?.length"
            data-action="add-annotation"
            theme="create"
            @click="addAnnotation()"
          >
            +
          </traction-button>
        </div>
      </div>
      <!-- Annotation items -->
      <div class="flex flex-col w-full bg-gray-100 rounded-md">
        <div v-for="(annotation, idx) in annotations" :key="annotation.id">
          <div class="flex flex-row border-y">
            <div class="flex w-5/6">
              <AnnotationItem
                :id="annotation.id"
                :parent="props.parent"
                :annotation-type-select-options="selectOptions"
                @remove-annotation="removeAnnotation($event)"
              />
            </div>
            <div class="flex flex-row justify-end items-center p-2 gap-2 w-1/6">
              <traction-button
                v-if="annotation.newRecord"
                :data-action="`remove-annotation-${annotation.id}`"
                theme="delete"
                @click="removeAnnotation(annotation.id)"
                >-</traction-button
              >
              <traction-button
                v-if="idx === annotations.length - 1"
                :data-action="`add-annotation-${annotation.id}`"
                theme="create"
                @click="addAnnotation()"
              >
                +
              </traction-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/**
 * AnnotationList Component
 * -----------------------
 * Renders a list of annotations for a given parent resource (e.g., run, well, etc.).
 * Provides UI for viewing, adding, and removing annotations, with dynamic columns and controls.
 *
 * Features:
 * - Displays annotation rows with fields: Comment, User, Annotation Type, and optionally Created At.
 * - Dynamically shows/hides the 'Created At' column if any annotation has a created_at value.
 * - Allows adding new annotations via a '+' button, which appears for the last annotation or when none exist.
 * - Allows removing annotations via a '-' button, which is rendered for each annotation row.
 */

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

/**
 * Property for select options for annotation types.
 * @type {Array}
 */
const selectOptions = annotationTypeSelectOptions(props.annotationTypes)

/**
 * Computed property for the list of annotations from the parent object.
 * @type {import('vue').ComputedRef<Array>}
 */
const annotations = computed(() => props.parent.annotationList)

/**
 * Computed property for the section title.
 * @type {import('vue').ComputedRef<string>}
 */
const title = computed(() => {
  return `${singularise(capitalizeFirstLetter(props.parent.type))} Annotations`
})

/**
 * Computed property for the data-list attribute value.
 * @type {import('vue').ComputedRef<string>}
 */
const dataList = computed(() => {
  return `${singularise(props.parent.type)}-annotations`
})

/**
 * Adds a new annotation to the list.
 * The new annotation will have a unique ID and be marked as a new record.
 * It will be added to the parent object's annotations.
 * @function
 * @returns {void}
 */
const addAnnotation = () => {
  const id = crypto.randomUUID()
  annotations.value.push(AnnotationItemType({ id, newRecord: true }))
}

/**
 * Removes an annotation from the list by its ID.
 * @function
 * @param {string} id - The ID of the annotation to remove.
 * @returns {void}
 */
const removeAnnotation = (id) => {
  const index = annotations.value.findIndex((annotation) => annotation.id === id)
  if (index !== -1) {
    annotations.value.splice(index, 1)
  }
}
</script>
