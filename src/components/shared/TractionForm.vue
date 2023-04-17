<template>
  <flagged-feature name="enable_custom_form">
    <template #disabled
      ><b-form :class="classes" @submit.prevent="submitAction" @reset.prevent="resetAction">
        <slot />
      </b-form>
    </template>
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
  </flagged-feature>
</template>
<script>
import { BForm } from 'bootstrap-vue'
export default {
  /**
   * # TractionForm
   *
   * Tailwind component to display a form  component using html <form> element
   */
  name: 'TractionForm',
  components: { BForm },
  inheritAttrs: false,
  props: {
    //any custom tailwind class to set the styling option
    classes: {
      type: String,
      default: '',
    },
  },
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
