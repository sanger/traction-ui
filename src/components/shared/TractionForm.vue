<template>
  <flagged-feature name="enable_custom_form">
    <template #disabled
      ><b-form :class="classes" @submit="submitAction" @reset="resetAction">
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
  name: 'TractionForm',
  components: { BForm },
  inheritAttrs: false,
  props: {
    classes: {
      type: String,
      default: '',
    },
  },
  methods: {
    submitAction() {
      this.$emit('submit')
    },
    resetAction() {
      this.$emit('reset')
    },
  },
}
</script>
