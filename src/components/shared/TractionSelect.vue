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
  <div>
    <flagged-feature name="enable_custom_select">
      <template #disabled>
        <b-form-select
          v-bind="$attrs"
          :value="value"
          :options="options"
          :place-holder="placeholder"
          title="title"
          @input="(val) => input(val)"
        />
      </template>
      <div class="flex flex-col">
        <label v-if="label">{{ label }}</label>
        <select
          v-if="options"
          v-bind="$attrs"
          :value="value"
          :placeholder="placeholder"
          :class="`w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:bg-gray-200 disabled:cursor-not-allowed ${classes}`"
          @change="(event) => input(event.target.value)"
        >
          <option
            v-for="option in getOptions"
            :key="option.value"
            :value="option.value == null ? '' : option.value"
            :disabled="option.disabled"
          >
            {{ option.text }}
          </option>
        </select>
      </div>
    </flagged-feature>
  </div>
</template>

<script>
import { BFormSelect } from 'bootstrap-vue'
export default {
  /**
   * # TractionSelect
   *
   * Tailwind component to display a select field using html <select> element
   */
  name: 'TractionSelect',
  components: { BFormSelect },
  inheritAttrs: false,
  props: {
    //value field of select which will be bind automatically with 'v-model' prop passed into the component
    value: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array,
      default() {
        return [{ text: '', value: '' }]
      },
    },
    //Title to display on top of the select, if given
    label: {
      type: String,
      default: '',
    },
    //any custom tailwind class to override the default options
    classes: {
      type: String,
      default: '',
    },
    //placeholder value
    placeholder: {
      type: String,
      default: '',
    },
  },
  computed: {
    /**
     * Options can be given in any of the following forms to support the existing usages
     * 1. As a normal string array e.g ['text1','text2'] . In this case both 'text'
     *    and 'value' fields will be set as the strings in array
     * 2. As an array of objects of 'text' and 'value' fields e.g [{text:'sample text', value:"text1", disabled:true}]
     * **/
    getOptions() {
      return this.options.map((option) => {
        if (typeof option == 'string') {
          return { text: option, value: option, disabled: false }
        }
        return { ...option }
      })
    },
  },
  methods: {
    input(selectedValue) {
      // Emit selected value
      this.$emit('input', selectedValue)
    },
  },
}
</script>
