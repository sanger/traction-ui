<template>
  <div data-type="annotation">
    <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
      <traction-input
        v-model="annotation.comment"
        type="text"
        placeholder="Example: Annotation 1"
        class="w-full"
        :disabled="!annotation.newRecord"
        data-attribute="comment"
      ></traction-input>
      <traction-input
        v-model="annotation.user"
        type="text"
        placeholder="Example: si5"
        class="w-full"
        :disabled="!annotation.newRecord"
        data-attribute="user"
      ></traction-input>
      <traction-select
        v-model="annotation.annotation_type_id"
        :options="annotationTypeSelectOptions()"
        class="w-full"
        :disabled="!annotation.newRecord"
        data-attribute="annotation-type"
      ></traction-select>
      <div data-attribute="created-at">
        {{ annotation.created_at }}
      </div>
    </div>

    <traction-button
      v-if="annotation.newRecord"
      data-action="remove-annotation"
      theme="delete"
      @click="removeAnnotation(id)"
      >-</traction-button
    >
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  /**
   * The id of the annotation
   * @type {String}
   * @required
   */
  id: {
    type: String,
    required: true,
  },
  /**
   * The parent object to which the annotation belongs
   * This could be a run, or any other resource that supports annotations.
   * It will be part of the store
   * @type {Object}
   * @required
   */
  parent: {
    type: Object,
    required: true,
  },
  /**
   * An object of annotation types
   * This is used to populate the select options for annotation types.
   * @type {Object}
   * @default {}
   * @example
   * {
   *   1: { id: 1, name: 'Type 1' },
   *   2: { id: 2, name: 'Type 2' },
   *   // ...
   * }
   */
  annotationTypes: {
    type: Object,
    default: () => ({}),
  },
})

const annotationTypeSelectOptions = () => [
  { label: 'Select Annotation Type', value: '' },
  ...Object.values(props.annotationTypes).map((type) => ({
    text: type.name,
    value: type.id,
  })),
]

const annotation = reactive(
  props.parent.annotations.find((annotation) => annotation.id === props.id),
)
</script>
