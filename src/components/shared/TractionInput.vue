<template>
  <div class="flex flex-col">
    <label v-if="title">{{ title }}</label>
    <input
      :data-attribute="dataAttribute"
      :placeholder="placeholder"
      :value="value"
      :type="type"
      :max="max"
      :min="min"
      :step="step"
      :class="`w-full border border-gray-300 p-2 rounded-md focus:ring-sdb-100 focus:border-sdb-100 disabled:opacity-75 disabled:cursor-not-allowed${classes}`"
      @input="input($event)"
    />
  </div>
</template>
<script>
import { within } from '@/lib/propValidations'
export default {
  /**
   * # TractionInput
   *
   * Tailwind component to display an input field
   */
  name: 'TractionInput',
  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    dataAttribute: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: within('text', 'number'),
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    classes: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      content: this.value,
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