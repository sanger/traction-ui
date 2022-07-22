<template>
  <div>
    <label v-if="labelText.length > 0" class="whitespace-nowrap"> {{ labelText }}</label>
    <input
      id="checkbox"
      :v-model="checked"
      type="checkbox"
      data-attribute="check-box"
    />
  </div>
</template>

<script>
export default {
  name: 'TractionCheckBox',
  props: {
    checked: {
      type: Boolean,
      required: true,
    },
    labelText: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>
