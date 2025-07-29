<template>
  <traction-section :title="title">
    <div
      :data-list="dataList"
      data-type="annotation-list"
      class="w-full p-2 bg-gray-200 rounded-md"
    >
      <!-- Header row -->
      <div class="flex w-full">
        <div class="w-5/6">
          <div
            :class="`grid gap-2 mb-2 w-full items-start ${isDisplayCreatedAt ? 'grid-cols-4' : 'grid-cols-3'}`"
          >
            <traction-label class="text-left">Comment</traction-label>
            <traction-label class="text-left">User</traction-label>
            <traction-label class="text-left">Annotation Type</traction-label>
            <traction-label v-if="isDisplayCreatedAt" class="ml-1">Created At</traction-label>
          </div>
        </div>
        <div class="w-1/6 flex justify-end gap-2">
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

      <div class="flex flex-col w-full">
        <div v-for="(annotation, idx) in annotations" :key="annotation.id">
          <div class="flex flex-row">
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
                :data-action="`remove-annotation-${annotation.id}`"
                theme="delete"
                class="h-18 min-h-0"
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

const isDisplayCreatedAt = computed(() => {
  // Return true if any annotation has a created_at field, else false
  return !!annotations.value?.some?.((annotation) => annotation.created_at)
})
</script>
