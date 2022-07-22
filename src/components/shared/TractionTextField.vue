<template>
  <div class="flex flex-col">
    <label v-if="labelText.length > 0" class="whitespace-nowrap"> {{ labelText }}</label>
    <input
      v-model="getValue"
      :data-attribute="dataAttributeValue"
      type="text"
      class="border border-gray-400 rounded h-8"
    />
  </div>
</template>

<script>
export default {
  name: 'TractionTextField',
  props: {
    value: {
      type: String,
      required: true,
    },
    labelText: {
      type: String,
      required: false,
      default: '',
    },
    dataAttributeValue: {
      type: String,
      required: false,
      default: '',
    },
    placeHolderText: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    getValue() {
      return this.value
    },
  },
}
</script>
