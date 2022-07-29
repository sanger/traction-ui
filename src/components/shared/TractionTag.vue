<template>
  <div :class="[`${getColor}`, 'text-gray-100', 'px-2 rounded-md font-semibold text-sm h-6']">
    <slot />
  </div>
</template>

<script>
export default {
/**
 * # TractionTag
 *
 * Tailwind component to display a tag 
 * with a text. Support for two colors
 * 
 * @example
 * <template>
 *   <div>
 *      <traction-tag>
 *        Tag Text
 *      </traction-tag>
 *   </div>
 * </template>
 */
  name: 'TractionTag',
  props: {
    color: {
      type: String,
      default: 'pink',
      validator: (value) => value == 'pink' || value == 'blue',
      required: false,
    },
  },
  computed: {
    getColor() {
      return this.color == 'blue' ? 'bg-sdb-300' : 'bg-sp'
    },
  },
}
</script>
