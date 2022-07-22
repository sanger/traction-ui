<template>
  <div
    :class="[
      'w-12 h-6 flex rounded-full p-1 duration-100 cursor-pointer bg-sdb-500',
      `${value ? 'bg-sdb-500' : 'bg-gray-300'}`,
    ]"
    :aria-checked="value.toString()"
    @click="toggle"
  >
    <div
      class="bg-white w-4 h-4 rounded-full shadow-md transform duration-100"
      :class="{ 'translate-x-6': value }"
    ></div>
  </div>
</template>

/** *A toggle switch component * Modified from * *
https://dev.to/fayaz/making-a-custom-toggle-switch-button-with-tailwindcss-and-vue-js-9cm **/

<script>
export default {
  name: 'TractionToggle',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value)
    },
  },
}
</script>
