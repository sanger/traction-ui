<template>
  <flagged-feature name="enable_custom_form">
    <template #disabled
      ><b-form @submit="submitAction" @reset="resetAction">
        <slot />
      </b-form>
    </template>
    <div class="flex flex-col">
      <form action="submitAction" reset="resetAction" >
        <slot />
      </form>
    </div>
  </flagged-feature>
</template>
<script>
import { BForm } from 'bootstrap-vue'
export default {
  name: 'TractionForm',
  components: { BForm },
  inheritAttrs: false,
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
