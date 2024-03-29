<!--
  TractionFieldGroup

  Renders a component with a label and description. 
  The props required for the rendered component is provided in 'componentProps'

  Following is the props required by TractionFieldGroup
  - label: The label to apply
  - description: Longer text providing more help
  - component: the type of component to render (if not handled in the slot)
  - componentProps: The props for the component to display
                    (E.g for configuration 'ReceptionForms' in /src/lib/receptions/index.js)
  - attribute : the value field name

  For example to display an input component with a label as 'Test Input' and description as "This is test input" and 
  the value field as 'inputValue', the props should be as below
   {
        label: 'Test Input',
        description: "This is test input",
        component: 'input',
        attribute: 'inputValue',
        componentProps: {
          type: 'number',
          step: '1',
          min: '0',
        },
      },
    }

  Note:
   v-model: binds with the given attribute field
   (This binding is required for any custom component (for e.g traction-input) that requires a 'v-model' directive as an argument to set a value internally/
-->
<template>
  <div
    class="flex justify-between mb-3"
    :class="{
      'flex-col': spacious,
      'flex-col md:flex-row': responsive,
      'flex-row': compact,
    }"
  >
    <div class="flex flex-col shrink text-left">
      <traction-label v-if="label" :for="fieldId" classes="mb-0">{{ label }}</traction-label>
      <traction-muted-text v-if="description">{{ description }}</traction-muted-text>
    </div>
    <component
      :is="component"
      v-if="component"
      :id="fieldId"
      :value="value"
      :data-attribute="attribute"
      v-bind="componentProps"
      @input="input"
    ></component>
    <div
      class="shrink-0 w-full md:w-1/2"
      :class="{
        'mt-2': spacious,
        'mt-2 md:mt-0': responsive,
        'mt-0': compact,
      }"
    >
      <slot></slot>
    </div>
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
    layout: {
      type: String,
      required: false,
      validator: (value) => ['responsive', 'compact', 'spacious'].includes(value),
      default: 'responsive',
    },
    label: { type: String, required: true },
    for: { type: String, required: false, default: null },
    attribute: { type: String, required: false, default: null },
    description: { type: String, required: false, default: null },
    component: { type: [String, Object], required: false, default: null },
    //The props for the component
    componentProps: { type: Object, required: false, default: () => ({}) },
    // We bind the value to the component, so the restrictions will mainly
    // come from that
    value: { type: [String, Number, Object, Array], required: false, default: null },
  },
  emits: ['input'],
  data: (component) => ({ fieldId: component.for || uniqueId() }),
  computed: {
    compact: ({ layout }) => layout == `compact`,
    responsive: ({ layout }) => layout == `responsive`,
    spacious: ({ layout }) => layout == `spacious`,
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
