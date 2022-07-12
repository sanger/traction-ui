<!--
  TractionInputGroup

  Renders a group of tags for collecting input
  - label: The label to apply
  - description: Longer text providing more help
  - component: the type of component to render (if not handled in the slot)
  - componentProps: The configuration for the component
-->
<template>
  <div>
    <label>{{ label }}</label>
    <component
      :is="component"
      v-if="component"
      :value="value"
      v-bind="componentProps"
      @input="input"
    ></component>
    <slot></slot>
    <div v-if="description">{{ description }}</div>
  </div>
</template>

<script>
// Imports

// Component
// See https://vuejs.org/v2/style-guide/#Component-instance-options-order-recommended
// for order of other options
export default {
  name: 'TractionInputGroup',
  props: {
    label: { type: String, required: true },
    description: { type: String, required: false, default: null },
    component: { type: [String, Object], required: false, default: null },
    componentProps: { type: Object, required: false, default: () => ({}) },
    // We bind the value to the component, so the restrictions will mainly
    // come from that
    value: { type: [String, Number, Object, Array], required: false, default: null },
  },
  methods: {
    input(event) {
      this.$emit('input', event.target.value)
    },
  },
}
</script>

<style scoped></style>
