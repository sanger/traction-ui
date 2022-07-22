<template>
  <div :class="`flex flex-col gap-y-4 ${classNames}`">
    <div class="text-left border-b-2 border-gray-300 mb-2 font-medium">{{ title }}</div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TractionSubSection',
  props: {
    title: {
      type: String,
      required: true,
    },
    classNames: {
      type: String,
      default: '',
    },
  },
}
</script>
