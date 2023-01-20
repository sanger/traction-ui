<!--
  TractionDirectionIcon

  Component to render a a left/right/top/bottom arrow icon
-->
<template>
  <svg
    class="h-3 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    stroke="currentColor"
    aria-hidden="true"
    :transform="`rotate(${transform})`"
  >
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
</template>

<script>
import { within } from '@/lib/propValidations'

export default {
  name: 'TractionArrowIcon',
  props: {
    //If result prop is "pass", displays a tick icon, otherwise a cross icon
    direction: {
      type: String,
      default: 'left',
      validator: within('up', 'down', 'left', 'right'),
    },
  },
  computed: {
    transform() {
      switch (this.direction) {
        case 'up':
          return 90
        case 'down':
          return 270
        case 'right':
          return 180
        default:
          return 0
      }
    },
  },
}
</script>
