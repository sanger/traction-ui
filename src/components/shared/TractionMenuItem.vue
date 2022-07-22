<template>
  <li
    :class="[
      'pl-2 pr-2 p-0 m-0 rounded-t-md', // No margins, padded left and right
      `hover:${getColor} hover:text-white transition-colors duration-200 ease-in-out`,
      'cursor-pointer',
      active ? `text-white ${getColor}` : `${getTextColor}`,
    ]"
  >
    <div :class="active ? `border-1  border-${getColor}` : ``">
      <slot />
    </div>
  </li>
</template>

<script>
export default {
  name: 'TractionMenuItem',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'pink',
      validator: (value) => value == 'blue' || value == 'pink',
    },
  },

  computed: {
    getColor() {
      return this.color == 'blue' ? 'bg-sdb-300' : 'bg-sp'
    },
    getTextColor() {
      return this.color == 'blue' ? 'text-sdb-300' : 'text-sp'
    },
  },
}
</script>
