<template>
  <div data-type="annotation">
    <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
      <traction-input
        id="library-volume"
        v-model="annotation.comment"
        type="text"
        step="any"
        placeholder="Example: Annotation 1"
        class="w-full"
        :disabled="!!isNewRecord()"
      ></traction-input>
      <div data-attribute="comment">
        {{ annotation.comment }}
      </div>
      <div data-attribute="created-at">
        {{ annotation.created_at }}
      </div>
      <div data-attribute="user">
        {{ annotation.user }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  /**
     * The annotation object containing details about the annotation
     * @example {
        id: '1',
        comment: 'annotation 1',
        created_at: '2023-10-01T12:00:00Z',
        user: 'lulu',
        annotation_type_id: '1',
        annotatable_type: 'Pacbio::Run'
      }
    */
  annotation: {
    type: Object,
    default: () => {
      return {
        id: 'new',
        comment: '',
        created_at: '',
        user: '',
        annotation_type_id: '',
        annotatable_type: '',
      }
    },
  },
})

const annotation = reactive(props.annotation)

const isNewRecord = () => props.annotation.id === 'new'
</script>
