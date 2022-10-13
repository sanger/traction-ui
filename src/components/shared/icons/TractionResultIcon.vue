<!--
  TractionResultIcon

  Component to render a tick(/pass) or cross(/fail) icon
-->
<template>
  <svg
    class="h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path
      v-if="hasPassed"
      fill="#00FF00"
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
    <path
      v-else
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
      fill="#FF0000"
    />
  </svg>
</template>

<script>
import { within } from '@/lib/propValidations'


export default {
  name: 'TractionResultIcon',
  props: {
    //If result prop is "pass", displays a tick icon, otherwise a cross icon 
    result: {
      type: String,
      default: 'pass',
      validator: within('pass', 'fail'),
    },
  },
  computed: {
    hasPassed() {
      return this.result == 'pass'
    },
  },
}
</script>
