<template>
  <div>
    <div :class="wellClassNames" data-attribute="traction-well" @click="click">
      <p v-if="position" class="truncate font-light">{{ position }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * An array of request ids associated with the well
   */
  requests: {
    type: Array,
    default() {
      return []
    },
  },
  position: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])

const getRequest = computed(() => (props.requests.length ? props.requests[0] : ''))

const wellClassNames = computed(() => {
  return [
    getRequest.value ? 'bg-green-600' : 'bg-black',
    getRequest.value.selected
      ? 'border-2 border-solid border-yellow-400'
      : 'border-1 border-solid border-black',
    'flex flex-col justify-center mx-auto rounded-full text-xs font-semibold aspect-square w-full select-none ',
  ]
})
const click = () => {
  const { id, selected } = getRequest.value
  emit('click', { id, selected })
}
</script>
