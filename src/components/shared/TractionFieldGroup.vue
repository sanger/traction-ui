<!--
  TractionFieldGroup

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
      :data-attribute="attribute"
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
  name: 'TractionFieldGroup',
  props: {
    label: { type: String, required: true },
    attribute: { type: String, required: false, default: null },
    description: { type: String, required: false, default: null },
    component: { type: [String, Object], required: false, default: null },
    componentProps: { type: Object, required: false, default: () => ({}) },
    // We bind the value to the component, so the restrictions will mainly
    // come from that
    value: { type: [String, Number, Object, Array], required: false, default: null },
  },
  methods: {
    input(value) {
      // Support either native components emiting events, or components
      // emitting just the value
      if (value instanceof Event) {
        this.$emit('input', value.target.value)
      } else {
        this.$emit('input', value)
      }
    },
  },
}
</script>

<style scoped></style>
