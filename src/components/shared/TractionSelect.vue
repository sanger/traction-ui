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
          :placeholder="placeholder"
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
          <template v-if="isGroupsExists">
            <optgroup
              v-for="(optionGroupName, index) in optionGroupNames"
              :key="'optionGroupName' + index"
              label="optionGroupName"
            >
              <option
                v-for="option in optionsForGroup(optionGroupName)"
                :key="option.value"
                :value="option.value == null ? '' : option.value"
                :disabled="option.disabled"
              >
                {{ option.text }}
              </option>
            </optgroup></template
          ><template v-else>
            <option
              v-for="option in formattedOptions"
              :key="option.value"
              :value="option.value == null ? '' : option.value"
              :disabled="option.disabled"
            >
              {{ option.text }}
            </option></template
          >
        </select>
      </div>
    </flagged-feature>
  </div>
</template>

<script>
import { BFormSelect } from 'bootstrap-vue'
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'
import _ from 'lodash-es'

export default {
  /**
   * # TractionSelect
   *
   * Tailwind component to display a select field using html <select> element
   */
  name: 'TractionSelect',
  components: { BFormSelect, FlaggedFeature },
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
     *    If only text field is given,value will be defaulted to text field ,
     * **/
    formattedOptions() {
      return this.options.map((option) => {
        let optionNew = { ...option }
        if (typeof option == 'string') {
          optionNew = { text: option, value: option, disabled: false, label: '' }
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
            label: 'label' in option ? option.label : '',
            disabled: 'disabled' in option ? option.disabled : false,
          }
        }
        return optionNew
      })
    },
    optionGroups() {
      const val = _.groupBy(this.formattedOptions, (val) => val.label)
      return val
    },
    optionGroupNames() {
      return Object.keys(this.optionGroups)
    },
    isGroupsExists() {
      const keys = Object.keys(this.formattedOptions)
      return keys.length > 0 && keys.some((key) => key.length > 0)
    },
  },
  methods: {
    input(selectedValue) {
      // Emit selected value
      this.$emit('input', selectedValue)
    },
    optionsForGroup(groupName) {
      return this.optionGroups[groupName]
    },
  },
}
</script>
