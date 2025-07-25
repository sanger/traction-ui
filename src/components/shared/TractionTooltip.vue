<template>
  <div
    id="tooltip-div"
    class="justify-end contents-end px-1 relative"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      v-show="hover"
      id="tooltip"
      :class="[
        'text-sm px-1 absolute rounded shadow-xl z-50',
        `${tooltipBgColour} ${tooltipTextColour} ${tooltipDirection} ${tooltipWrap}`,
      ]"
    >
      <template v-if="tooltipText">
        {{ tooltipText }}
      </template>
      <template v-else>
        <slot name="tooltip">
          <!-- Default content if no slot content or tooltipText is provided -->
          No tooltip content available.
        </slot>
      </template>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  tooltipText: {
    type: String,
    required: false,
    default: '',
  },
  tooltipBgColour: {
    type: String,
    required: false,
    default: 'bg-yellow-400',
  },
  tooltipTextColour: {
    type: String,
    required: false,
    default: 'text-gray-700',
  },
  tooltipDirection: {
    type: String,
    required: false,
    default: 'top-[-25px] left-0', // Default position above the element
  },
  tooltipWrap: {
    type: String,
    required: false,
    default: 'whitespace-nowrap', // Default text wrap
  },
})

/* A reactive reference to a boolean value indicating whether the element is being hovered over.
  This will be used to show the used volume tooltip when the user hovers over the used volume badge.
 */
const hover = ref(false)
</script>
