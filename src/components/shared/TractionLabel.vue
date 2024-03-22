<!--
  TractionLabel

  Simple style wrapper for labels
-->
<template>
  <label :class="`w-full font-sans text-gray-700 ${classes}`"><slot /></label>
</template>

<script>
export default {
  name: 'TractionLabel',
  props: {
    //any custom tailwind class to extend the default options
    classes: {
      type: String,
      default: '',
    },
  },
}
</script>
