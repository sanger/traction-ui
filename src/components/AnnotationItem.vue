<template>
  <div data-type="annotation" class="flex flex-row w-full">
    <div
      :class="`grid ${annotation.created_at ? 'grid-cols-4' : 'grid-cols-3'} gap-2 p-2 items-center  mt-1 bg-gray-200 rounded-md`"
    >
      <traction-field-error
        data-attribute="comment-error"
        :error="errorsFor('comment')"
        :with-icon="!!errorsFor('comment')"
      >
        <div class="flex flex-col py-2">
          <textarea
            v-model="annotation.comment"
            placeholder="Example: Annotation 1"
            class="w-full h-32 p-1 bg-white rounded-md focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:cursor-not-allowed"
            :disabled="!annotation.newRecord"
            maxlength="500"
            data-attribute="comment"
          ></textarea>
          <div class="text-xs text-gray-500 mt-1" data-attribute="comment-char-count">
            {{ (annotation.comment || '').length }} / 500 characters
          </div>
        </div>
      </traction-field-error>
      <traction-field-error
        data-attribute="user-error"
        :error="errorsFor('user')"
        :with-icon="!!errorsFor('user')"
      >
        <traction-input
          v-model="annotation.user"
          type="text"
          placeholder="Example: si5"
          class="w-full"
          :disabled="!annotation.newRecord"
          data-attribute="user"
        ></traction-input>
      </traction-field-error>
      <traction-field-error
        data-attribute="annotation-type-error"
        :error="errorsFor('annotation_type_id')"
        :with-icon="!!errorsFor('annotation_type_id')"
      >
        <traction-select
          v-model="annotation.annotation_type_id"
          :options="annotationTypeSelectOptions"
          class="w-full"
          :disabled="!annotation.newRecord"
          data-attribute="annotation-type"
        ></traction-select>
      </traction-field-error>
      <div v-if="annotation.created_at" class="ml-1" data-attribute="created-at">
        {{ annotation.created_at }}
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup>
/**
 * AnnotationItem Component
 * -----------------------
 * Renders a single annotation row for a parent resource (e.g., run, well, etc.).
 * Provides UI for editing annotation fields, displaying errors, and showing creation metadata.
 *
 * Features:
 * - Displays editable fields for comment, user, and annotation type, with validation and error display.
 * - Shows a 'Created At' column if the annotation has a created_at value.
 * - Uses traction-field-error to display validation errors for each field.
 * - Disables input fields for non-new records, allowing editing only for new annotations.
 * - Accepts annotation type options for the select input.
 * - Finds and binds the annotation object by id from the parent annotations array.

 */

import { reactive } from 'vue'

/**
 * AnnotationItem Component Props
 * -----------------------------
 * @property {String} id - The id of the annotation (required)
 * @property {Object} parent - The parent object to which the annotation belongs (required)
 * @property {Object} annotationTypeSelectOptions - Object of annotation types for select options (default: {})
 *   Example:
 *   {
 *     1: { id: 1, name: 'Type 1' },
 *     2: { id: 2, name: 'Type 2' },
 *     // ...
 *   }
 */
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  parent: {
    type: Object,
    required: true,
  },
  annotationTypeSelectOptions: {
    type: Object,
    default: () => ({}),
  },
})

/**
 * Returns the error message for a given annotation attribute.
 * @function
 * @param {string} attribute - The attribute name to check for errors.
 * @returns {string} Error message if value is missing, otherwise empty string.
 */
const errorsFor = (attribute) => {
  if (!annotation[attribute]) return 'No value provided'
  else return ''
}

/**
 * Reactive annotation object for this item, found by id in parent.annotations.
 * @type {import('vue').ReactiveEffect}
 */
const annotation = reactive(
  props.parent.annotationList.find((annotation) => annotation.id === props.id),
)
</script>
