<template>
  <menu
    class="my-2 text-gray-700 text-xs italiclist-none inline-flex ml-4 m-0 p-0 space-x-2 font-light"
  >
    <slot />
  </menu>
</template>

/**
 * Provides a softer text.
 **/
<script>
export default {
  name: 'TractionMutedText',
}
</script>
