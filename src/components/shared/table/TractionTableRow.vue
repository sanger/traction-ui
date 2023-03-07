<template>
  <flagged-feature name="enable_custom_table">
    <template #disabled>
      <b-tr>
        <slot />
      </b-tr>
    </template>
    <tr v-bind="$attrs" data-testid="row" :class="classes">
      <slot /></tr
  ></flagged-feature>
</template>
<script>
import { BTr } from 'bootstrap-vue'
export default {
  name: 'TractionTableRow',
  components: { BTr },
  inheritAttrs: false,
  props: {
    classes: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>
