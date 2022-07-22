<template>
  <menu
    :class="['list-none inline-flex ml-4 m-0 p-0 space-x-2 font-light', border ? `border-b-2` : ``]"
  >
    <slot />
  </menu>
</template>

<script>
export default {
  name: 'TractionMenu',
  props: {
    border: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
