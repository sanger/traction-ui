<!--
  TractionFieldGroup

  Renders a group of tags for collecting input
  - label: The label to apply
  - description: Longer text providing more help
  - component: the type of component to render (if not handled in the slot)
  - componentProps: The configuration for the component
-->
<template>
  <div class="text-left mb-5">
    <traction-label :for="fieldId">{{ label }}</traction-label>
    <component
      :is="component"
      v-if="component"
      :id="fieldId"
      :value="value"
      :data-attribute="attribute"
      v-bind="value"
      @input="input"
    ></component>
    <slot></slot>
    <div v-if="description" class="my-2 text-gray-700 text-xs italic">{{ description }}</div>
  </div>
</template>

<script>
// Imports
import uniqueId from 'lodash-es/uniqueId'
// Component
// See https://vuejs.org/v2/style-guide/#Component-instance-options-order-recommended
// for order of other options
export default {
  name: 'TractionFieldGroup',
  props: {
    label: { type: String, required: true },
    for: { type: String, required: false, default: null },
    attribute: { type: String, required: false, default: null },
    description: { type: String, required: false, default: null },
    component: { type: [String, Object], required: false, default: null },
    componentProps: { type: Object, required: false, default: () => ({}) },
    // We bind the value to the component, so the restrictions will mainly
    // come from that
    value: { type: [String, Number, Object, Array], required: false, default: null },
  },
  data: (component) => ({ fieldId: component.for || uniqueId() }),
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
