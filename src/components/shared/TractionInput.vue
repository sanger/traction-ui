<!--
  TractionInput 
  
  Renders a custom input tailwind component to display an input field with an optional label 
   - Title represents the label to be displayed (if required)
   - v-bind="$attrs" in <input> is to support fallthrough attributes to ensure that all recieving components props 
      is passed to the enclosed html <input> component. This allows to use this component as a normal html <input> 
      element by passing in all props allowed in <input> to <traction-input>
     The $attrs object includes all attributes that are not declared by the component's props
  - @input - On input, emit its own custom input event with the new value
  - @keyup.enter - On enter, allow emiting of the custom input event 
-->

<template>
  <div class="flex flex-col" :class="$attrs.class">
    <label v-if="title">{{ title }}</label>
    <input
      v-bind="$attrs"
      ref="inputRef"
      :value="displayValue()"
      :data-attribute="dataAttribute"
      :class="`w-full border border-gray-300 p-2 rounded-md focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:cursor-not-allowed ${classes}`"
      @input="input($event)"
      @keyup.enter="input($event)"
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
    //modelValue field of input which will be bind automatically with 'v-model' prop passed into the component
    modelValue: {
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
    //The time in ms to debounce the input events
    debounce: {
      type: [Number, String],
      default: 0,
    },
    //Formatter function to format the displayed value in input field, if given
    formatter: {
      type: Function,
      default: undefined,
    },
    // Although the type attribute is passed through the $attrs object to support fallthrough attributes,
    // it is explicitly defined here for clarity and to ensure proper type handling.
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['enterKeyPress', 'update:modelValue'],
  data() {
    return {
      debounceTimer: null,
    }
  },
  methods: {
    input(event) {
      // If a formatter is present we want to format the input
      if (this.formatter) {
        event.target.value = this.formatter(event.target.value)
      }

      if (event.key === 'Enter') {
        this.$emit('enterKeyPress', event.target.value)
      }
      // If debounce is supplied we want to debounce the update events
      if (this.debounce > 0) {
        if (this.debounceTimer) clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
          this.$emit('update:modelValue', event.target.value)
        }, this.debounce)
      } else {
        // Emit text data the payload event
        this.$emit('update:modelValue', event.target.value)
      }
    },
    displayValue() {
      //Formatter function given, so return formated value to display
      if (this.formatter) {
        return this.formatter(this.modelValue)
      }
      return this.modelValue
    },
  },
}
</script>
