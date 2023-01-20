<!--
  TractionSortIcon

  Component to render a sort function icon
-->
<template>
  <div class="flex flex-col">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="20"
      width="20"
      :transform="`rotate(90)`"
      stroke="currentColor"
      class="text-sdb-300 fill-current hover:text-sdb"
    >
      <path d="M8.5 15 3 10l5.5-5Zm-1-2.25v-5.5L4.5 10Zm4 2.25V5l5.5 5Z" />
    </svg>
    <svg
      v-if="direction == 'none'"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="20"
      width="20"
      stroke="currentColor"
      class="text-gray-100 fill-current hover:text-sdb"
    >
      <path d="M8.5 15 3 10l5.5-5Zm-1-2.25v-5.5L4.5 10Zm4 2.25V5l5.5 5Z" />
    </svg>
  </div>
</template>

<script>
import { within } from '@/lib/propValidations'

export default {
  name: 'TractionSortIcon',
  props: {
    direction: {
      type: String,
      default: 'up',
    },
  },
  computed: {
    transform() {
      switch (this.direction) {
        case 'up':
          return 180
        default:
          return 90
      }
    },
    color() {
      switch (this.direction) {
        case 'none':
          return 'text-gray-100'
        default:
          return 'text-sdb-400'
      }
    },
  },
}
</script>
