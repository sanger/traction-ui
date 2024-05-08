<!--/**
   * # TractionTableRow
   *
   * * This component provides a wrapper for a boot-strap <b-tr> and HTML <tr> 
   *
   * @example
   * 
   */
-->
<template>
  <tr v-bind="$attrs" data-testid="row" :class="classes" @click="handleClick">
    <slot />
  </tr>
</template>
<script>
export default {
  name: 'TractionTableRow',
  inheritAttrs: false,
  props: {
    classes: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['click'],
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>
