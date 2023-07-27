<template>
  <form
    v-bind="$attrs"
    :class="classes"
    action=""
    reset=""
    @submit.prevent="submitAction"
    @reset.prevent="resetAction"
  >
    <slot />
  </form>
</template>
<script>
export default {
  /**
   * # TractionForm
   *
   * Tailwind component to display a form  component using html <form> element
   */
  name: 'TractionForm',
  inheritAttrs: false,
  props: {
    //any custom tailwind class to set the styling option
    classes: {
      type: String,
      default: '',
    },
  },
  emits: ['submit', 'reset'],
  methods: {
    /**submit event will be emitted externally on submit */
    submitAction() {
      this.$emit('submit')
    },
    /**reset event will be emitted externally on reset */
    resetAction() {
      this.$emit('reset')
    },
  },
}
</script>
