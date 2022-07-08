<template>
  <li
    :class="[
      'pl-2 pr-2 p-0 m-0', // No margins, padded left and right
      'hover:bg-sp hover:text-white transition-colors duration-200 ease-in-out',
      'cursor-pointer',
      active ? 'text-white bg-sp' : 'text-sp',
    ]"
  >
    <slot />
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
  },
}
</script>
