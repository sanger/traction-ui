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
  <flagged-feature name="enable_custom_table">
    <template #disabled>
      <b-td>
        <slot />
      </b-td>
    </template>
    <td
      :id="id"
      data-testid="column"
      v-bind="$attrs"
      :class="`px-1 py-1 text-sm whitespace-nowrap text-center ${classes}`"
      @click="click"
    >
      <slot />
    </td>
  </flagged-feature>
</template>
<script>
import { BTd } from 'bootstrap-vue'
export default {
  name: 'TractionTableColumn',
  components: { BTd },
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
  },
  methods: {
    click() {
      // Emit text data the payload event
      this.$emit('click', this.id)
    },
  },
}
</script>
