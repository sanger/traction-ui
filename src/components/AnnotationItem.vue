<template>
  <div data-type="annotation">
    <div class="p-2 mb-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm">
      <traction-input
        v-model="annotation.comment"
        type="text"
        placeholder="Example: Annotation 1"
        class="w-full"
        :disabled="!isNewRecord"
        data-attribute="comment"
      ></traction-input>
      <traction-input
        v-model="annotation.user"
        type="text"
        placeholder="Example: si5"
        class="w-full"
        :disabled="!isNewRecord"
        data-attribute="user"
      ></traction-input>
      <div data-attribute="created-at">
        {{ annotation.created_at }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
    default: () => ({
      id: 'new',
      comment: '',
      created_at: '',
      user: '',
      annotation_type_id: '',
      annotatable_type: '',
    }),
  },
})

const annotation = ref({ ...props.annotation })

const isNewRecord = computed(() => props.annotation.id === 'new')
</script>
