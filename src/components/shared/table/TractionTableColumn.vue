<!--/**
   * # TractionTableColumn
   *
   * This component provides a wrapper for a boot-strap <b-td> and HTML <td>
   *
   * @example
   * 
   */
-->
<template>
  <td
    :id="id"
    data-testid="column"
    v-bind="$attrs"
    :colspan="colspan"
    :class="`px-1 py-1 text-sm whitespace-nowrap text-center ${classes}`"
    @click="click"
  >
    <slot />
  </td>
</template>
<script>
export default {
  name: 'TractionTableColumn',
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default: '',
    },
    classes: {
      type: String,
      required: false,
      default: '',
    },
    colspan: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  emits: ['click'],
  methods: {
    click() {
      // Emit text data the payload event
      this.$emit('click', this.id)
    },
  },
}
</script>
