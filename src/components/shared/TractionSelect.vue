<!--
  TractionSelect 
  
  Renders a custom select tailwind component to display a select field with an optional label 
   - Title represents the label to be displayed (if required)
   - v-bind="$attrs" in <input> is to support fallthrough attributes to ensure that all recieving components props 
      is passed to the enclosed html <select> component. This allows to use this component as a normal html <select> 
      element by passing in all props allowed in <select> to <traction-select>
     The $attrs object includes all attributes that are not declared by the component's props
  - @chnage - On change, emit its own custom input event with the new value
-->

<template>
  <div class="flex flex-col">
    <label v-if="title">{{ title }}</label>
    <select
      v-if="options"
      v-bind="$attrs"
      :value="value"
      :class="`w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:bg-gray-200 disabled:cursor-not-allowed ${classes}`"
      @change="input($event)"
    >
      <option v-if="optionHeader" value="" disabled="true">{{ optionHeader }}</option>
      <option v-for="option in getOptions" :key="option.text" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  /**
   * # TractionSelect
   *
   * Tailwind component to display a select field using html <select> element
   */
  name: 'TractionSelect',
  inheritAttrs: false,
  props: {
    //value field of select which will be bind automatically with 'v-model' prop passed into the component
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default() {
        return [{ text: '', value: '' }]
      },
    },
    //Title to display on top of the select, if given
    title: {
      type: String,
      default: '',
    },
    //any custom tailwind class to override the default options
    classes: {
      type: String,
      default: '',
    },
    //header/title for options displayed which is disabled
    optionHeader: {
      type: String,
      default: '',
    },
  },
  computed: {
    /**
     * Options can be given in any of the following forms to support the existing usages
     * 1. As a normal string array e.g ['text1','text2'] . In this case both 'text'
     *    and 'value' fields will be set as the strings in array
     * 2. As an array of objects of 'text' and 'value' fields e.g [{text:'sample text', value:"text1"}]
     * 3. As an array of objects of form [{text:'sample text'}]. In this case both 'text'
     *    and 'value' fields will be set to 'text' field data
     * 4. As an array of objects of form [{value:'sample value'}]. In this case both text
     *    and value fields will be set to 'value' field data
     * **/
    getOptions() {
      return this.options.map((option) => {
        if (typeof option == 'string') {
          return { text: option, value: option }
        } else if (typeof option == 'object') {
          if ('text' in option && 'value' in option) {
            return option
          } else if (!('text' in option) && 'value' in option) {
            return { text: option.value, value: option.value }
          } else if ('text' in option && !('value' in option)) {
            return { text: option.text, value: option.text }
          }
        }
        return option
      })
    },
  },
  methods: {
    input(event) {
      // Emit select data
      this.$emit('input', event.target.value)
    },
  },
}
</script>
