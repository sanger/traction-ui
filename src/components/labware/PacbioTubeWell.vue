<template>
    <div :class="wellClassNames" data-attribute="traction-well" @click="click">
    </div>
</template>

<script setup>
/**
 * @name PacbioTubeWell
 * @description Renders a single well (can be used in a Tube) without any store interaction
 * @param {Array} requests - An array of request ids associated with the well
 * @param {String} position - The position of the well
 * @emits click - Emits the request id and selected status of the well
 */
import { computed } from 'vue'

const props = defineProps({
  /**
   * An array of request ids associated with the well
   */
  requests: {
    type: Object,
    required: true,
  },
})
// Emits the request id and selected status of the well
const emit = defineEmits(['click'])

// Returns the first request in the requests array
const getRequest = computed(() => (props.requests.length ? props.requests[0] : ''))

/*
 * Returns the class names for the well
 * If the well is selected, it will have a yellow border
 * If the well has a request, it will have a green background
 * Otherwise, it will have a gray background
 */
const wellClassNames = computed(() => {
  return [
    getRequest.value ? 'bg-green-600' : 'bg-gray-500',
    getRequest.value.selected
      ? 'border-2 border-solid border-yellow-400'
      : 'border-1 border-solid border-gray-500',
    'flex flex-col md:w-32 justify-center mx-auto rounded-full text-xs font-semibold aspect-square select-none ',
  ]
})
/**
 * Emits the request id and selected status of the well when clicked
 */
const click = () => {
  const { id, selected } = getRequest.value
  emit('click', { id, selected })
}
</script>
