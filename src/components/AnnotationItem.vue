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
      <traction-select
        v-model="annotation.annotation_type_id"
        :options="annotationTypeSelectOptions"
        class="w-full"
        :disabled="!isNewRecord"
        data-attribute="annotation-type"
      ></traction-select>
      <div data-attribute="created-at">
        {{ annotation.created_at }}
      </div>
    </div>

    <traction-button
      v-if="isNewRecord"
      data-action="remove-annotation"
      theme="destroy"
      @click="removeAnnotation(localId)"
      >-</traction-button
    >
  </div>
</template>

<script setup>
import { computed, reactive, useId } from 'vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'

const newAnnotation = {
  id: 'new',
  comment: '',
  created_at: '',
  user: '',
  annotation_type_id: '',
  annotatable_type: '',
}

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
    default: () => ({}),
  },
})

const store = usePacbioRunCreateStore()

const annotationTypeSelectOptions = computed(() => [
  { label: 'Select Annotation Type', value: '' },
  ...Object.values(store.resources.annotationTypes).map((type) => ({
    text: type.name,
    value: type.id,
  })),
])

const annotation = reactive({ ...newAnnotation, ...props.annotation })

const isNewRecord = computed(() => annotation.id === 'new')

const localId = useId()
</script>
