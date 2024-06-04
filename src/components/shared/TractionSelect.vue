<template>
  <div class="flex flex-col" :class="$attrs.class">
    <label v-if="label">{{ label }}</label>
    <select
      v-if="options"
      v-bind="$attrs"
      v-model="propValue"
      :placeholder="placeholder"
      :data-attribute="dataAttribute"
      :class="`w-full py-2 px-3 border border-gray-300 bg-white bg-transparent hover:border-sdb-200 rounded-md shadow-sm focus:outline-none focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:bg-gray-200 disabled:cursor-not-allowed ${classes}`"
    >
      <template v-for="(optionGroupName, index) in optionGroupNames">
        <template v-if="optionGroupName">
          <optgroup :key="'optionGroupName' + index" :label="optionGroupName">
            <option
              v-for="option in optionsForGroup(optionGroupName)"
              :key="option.value"
              :value="option.value == null ? '' : option.value"
              :disabled="option.disabled"
            >
              {{ option.text }}
            </option>
          </optgroup>
        </template>
        <template v-else>
          <option
            v-for="option in optionsForGroup(optionGroupName)"
            :key="option.value"
            :value="option.value == null ? '' : option.value"
            :disabled="option.disabled"
          >
            {{ option.text }}
          </option>
        </template>
      </template>
    </select>
  </div>
</template>

<script>
import _ from 'lodash-es'

export default {
  /**
   * # TractionSelect
   *
   * Tailwind component to display a select field using html <select> element
   * Renders a custom select tailwind component to display a select field with an optional label
   *    - Title represents the label to be displayed (if required)
   *    - v-bind="$attrs" in <input> is to support fallthrough attributes to ensure that all receiving components props
   *      is passed to the enclosed html <select> component. This allows to use this component as a normal html <select>
   *      element by passing in all props allowed in <select> to <traction-select>
   *      The $attrs object includes all attributes that are not declared by the component's props
   *    - @change - On change, emit its own custom input event with the new value
   */
  name: 'TractionSelect',
  inheritAttrs: false,
  props: {
    // modelValue field of select which will be bind automatically with 'v-model' prop passed into the component
    // renamed from value because of vue3 breaking changes to v-model (https://v3-migration.vuejs.org/breaking-changes/v-model.html)
    modelValue: {
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
    //attribute name to represent this component for testing, if given
    dataAttribute: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    propValue: {
      get() {
        // if modelValue is null or undefined we want to use an empty ''
        return this.modelValue || ''
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
    /**
     * Options can be given in any of the following forms to support the existing usages
     * 1. As a normal string array e.g ['text1','text2'] . In this case both 'text'
     *    and 'value' fields will be set as the strings in array
     * 2. As an array of objects of 'text' and 'value' fields e.g [{text:'sample text', value:"text1", disabled:true}]
     *    If only text field is given,value will be defaulted to text field ,
     * 3. As an array of option groups with 'label' as option group name and 'options' field as options within that group
     *    e.g [{label: "Group 1", options:[{text:'sample text', value:"text1", disabled:true}]}]
     * **/
    formattedOptions() {
      let retOptions = []
      this.options.map((option) => {
        /**
         * Flat pack and restructure all options with 'label feld' . An empty label field indicate
         * that the option doesn't belong to any group
         */
        if (typeof option == 'object' && 'label' in option && 'options' in option) {
          const formattedOptions = option.options.map((optionVal) =>
            this.formatOption(optionVal, option.label),
          )
          retOptions = [...retOptions, ...formattedOptions]
        } else {
          retOptions.push(this.formatOption(option, ''))
        }
      })
      return retOptions
    },
    /*Create groups of options based on label field */
    optionGroups() {
      const val = _.groupBy(this.formattedOptions, (val) => val.label)
      return val
    },
    /**Return all option group names available */
    optionGroupNames() {
      return Object.keys(this.optionGroups)
    },
  },

  methods: {
    /**Format the option fields (if required) as expected by html select*/
    formatOption(option, label) {
      let optionNew = { ...option }
      if (typeof option == 'string') {
        optionNew = { text: option, value: option, disabled: false }
      }
      if (typeof option == 'object') {
        if ('text' in option && !('value' in option)) {
          optionNew = {
            text: option.text,
            value: option.text,
          }
        }
        optionNew = {
          ...optionNew,
          disabled: 'disabled' in option ? option.disabled : false,
        }
      }
      return { ...optionNew, label: label }
    },
    /**Retrieve all options that belong to the given option group name */
    optionsForGroup(groupName) {
      return this.optionGroups[groupName]
    },
  },
}
</script>
