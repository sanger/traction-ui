<template>
  <span :class="`text-xs text-gray-700 font-light italic ${classes}`">
    <slot />
  </span>
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
  props: {
    //any custom tailwind class to extend the default options
    classes: {
      type: String,
      default: '',
    },
  },
}
</script>
