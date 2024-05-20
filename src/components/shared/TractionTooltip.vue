<template>
  <div
    id="tooltip-div"
    class="justify-end contents-end px-1 relative"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      v-show="hover"
      id="tooltip-text"
      class="text-sm px-1 bg-yellow-400 text-gray-700 absolute rounded bg-opacity-75 shadow-xl left-0 top-[-25px]"
    >
      {{ tooltipText }}
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tooltipText: {
    type: String,
    required: true,
  },
})

/* A reactive reference to a boolean value indicating whether the element is being hovered over.
  This will be used to show the used volume tooltip when the user hovers over the used volume badge.
 */
const hover = ref(false)
</script>
