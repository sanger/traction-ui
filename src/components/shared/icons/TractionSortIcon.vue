<!--
  TractionSortIcon

  Component to render a sort function icon
-->
<template>
  <svg
    class="svg-icon"
    style="width: 18; height: 18; vertical-align: middle; fill: currentColor; overflow: hidden"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      :fill="upButtonColor()"
      d="M524.545 111.846L795.47 454.069c5.485
    6.928 4.315 16.99-2.613 22.476a16 16 0 0 1-9.932 3.455H208l291.455-368.154c5.485-6.928
    15.548-8.098 22.476-2.614a16 16 0 0 1 2.614 2.614z"
    />
    <path
      :fill="downButtonColor()"
      d="M524.545 914.154L816 546H241.074c-8.837 0-16 7.163-16 16a16 16 0 0 0 3.455 9.931l270.926 342.223c5.485 6.928 15.548 8.098 22.476 2.614a16 16 0 0 0 2.614-2.614z"
    />
  </svg>
</template>

<script>
import { within } from '@/lib/propValidations'

export default {
  name: 'TractionSortIcon',
  props: {
    direction: {
      type: String,
      default: 'ascend',
      validator: () => within('ascend', 'descend', 'none'),
    },
  },
  methods: {
    upButtonColor() {
      return this.direction == 'ascend' ? '#000000' : '#C1CDC6'
    },
    downButtonColor() {
      return this.direction == 'descend' ? '#000000' : '#C1CDC6'
    },
  },
}
</script>
