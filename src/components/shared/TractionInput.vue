<template>
  <div class="flex flex-col">
    <label v-if="title">{{ title }}</label>
    <input
      :id="id"
      :value="content"
      :data-attribute="dataAttribute"
      :placeholder="placeholder"
      :type="type"
      :max="max"
      :min="min"
      :step="step"
      :disabled="disabled"
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
    //Place holder text to display in input component, if given
    placeholder: {
      type: String,
      default: '',
    },
    //Title to display on top of the input, if given
    title: {
      type: String,
      default: '',
    },
    //type of input component, supports all types given for <input> html element. The default will be 'text'
    type: {
      type: String,
      default: 'text',
    },

    /**
     * min, max and step props comes into effect if type property is 'number'.
     * traction-input with type = 'number' will behave same like html <input> element and will display a spinner component
     */

    //minimum value the component can accept if the type is 'number'
    min: {
      type: String,
      default: '0',
    },
    //max value the component can accept if the type is 'number'
    max: {
      type: String,
      default: '100',
    },
    //the amount of increment if the type is 'number'
    step: {
      type: String,
      default: '1',
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
    //disabled or not? - if disabled user cannot enter values
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      content: this.type == 'number' ? Number(this.value) : this.value,
    }
  },

  methods: {
    input(event) {
      // Emit text data the payload event
      this.$emit('input', event.target.value)
    },
  },
}
</script>
