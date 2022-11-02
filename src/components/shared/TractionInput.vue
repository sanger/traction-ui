<!--
  TractionInput 
  
  Renders a custom input tailwind component to display an input field with an optional label 
   - Title represents the label to be displayed (if required)
   - v-bind="$attrs" in <input> is to support fallthrough attributes to ensure that all recieving components props 
      is passed to the enclosed html <input> component. This allows to use this component as a normal html <input> 
      element by passing in all props allowed in <input> to <traction-input>
  - @input - On input, emit its own custom input event with the new value
-->

<template>
  <div class="flex flex-col">
    <label v-if="title">{{ title }}</label>
    <input
      v-bind="$attrs"
      :value="value"
      :data-attribute="dataAttribute"
      :class="`w-full border border-gray-300 p-2 rounded-md focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:cursor-not-allowed${classes}`"
      @input="input($event)"
    />
  </div>
</template>
<script>
export default {
  /**
   * # TractionInput
   *
   * Tailwind component to display an input field using html <input> element
   */
  name: 'TractionInput',
  inheritAttrs: false,
  props: {
    //value field of input which will be bind automatically with 'v-model' prop passed into the component
    value: {
      type: [Number, String],
      default: '',
    },
    //attribute name to represent this component for testing, if given
    dataAttribute: {
      type: String,
      default: '',
    },
    //Title to display on top of the input, if given
    title: {
      type: String,
      default: '',
    },
    //any custom tailwind class to override the default options
    classes: {
      type: String,
      default: '',
    },
    //id field
    id: {
      type: String,
      default: '',
    },
  },

  methods: {
    input(event) {
      // Emit text data the payload event
      this.$emit('input', event.target.value)
    },
  },
}
</script>
