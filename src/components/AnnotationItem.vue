<template>
  <div data-type="annotation">
    <div class="flex flex-row rounded-md justify-between space-x-2 p-2 bg-gray-200">
      <fieldset>
        <traction-label class="ml-1">Comment</traction-label>
        <traction-input
          v-model="annotation.comment"
          type="text"
          placeholder="Example: Annotation 1"
          class="w-full"
          :disabled="!annotation.newRecord"
          data-attribute="comment"
        ></traction-input>
      </fieldset>
      <fieldset>
        <traction-label class="ml-1">User</traction-label>
        <traction-input
          v-model="annotation.user"
          type="text"
          placeholder="Example: si5"
          class="w-full"
          :disabled="!annotation.newRecord"
          data-attribute="user"
        ></traction-input>
      </fieldset>
      <fieldset>
        <traction-label class="ml-1">Annotation Type</traction-label>
        <traction-select
          v-model="annotation.annotation_type_id"
          :options="annotationTypeSelectOptions"
          class="w-full"
          :disabled="!annotation.newRecord"
          data-attribute="annotation-type"
        ></traction-select>
      </fieldset>
      <fieldset>
        <traction-label class="ml-1">Created At</traction-label>
        <div class="ml-1" data-attribute="created-at">
          {{ annotation.created_at }}
        </div>
      </fieldset>
      <fieldset>
        <traction-button
          v-if="annotation.newRecord"
          data-action="remove-annotation"
          theme="delete"
          @click="removeAnnotation"
          >-</traction-button
        >
      </fieldset>
    </div>
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
  annotationTypeSelectOptions: {
    type: Object,
    default: () => ({}),
  },
})

const annotation = reactive(
  props.parent.annotations.find((annotation) => annotation.id === props.id),
)

const emit = defineEmits(['remove-annotation'])

const removeAnnotation = () => {
  emit('remove-annotation', props.id)
}
</script>
