<template>
  <menu
    class="my-2 text-gray-700 text-xs italic list-none inline-flex m-0 p-0 space-x-2 font-light"
  >
    <slot />
  </menu>
</template>

<script>
/**
 * # TractionMutedText
 *
 * Tailwind component to display a softer text
 *
 * @example
 * <template>
 *   <div>
 *      <traction-muted-text>
 *         Text to display
 *      </traction-muted-text>
 *   </div>
 * </template>
 */
export default {
  name: 'TractionMutedText',
}
</script>
