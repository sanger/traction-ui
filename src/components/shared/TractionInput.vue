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
    },
    min: {
      type: String,
      default: '0',
    },
    max: {
      type: String,
      default: '100',
    },
    step: {
      type: String,
      default: '1',
    },

    classes: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
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
