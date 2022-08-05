<template>
  <li
    :class="[
      'pl-2 pr-2 p-0 m-0 rounded-t-md', // No margins, padded left and right
      `hover:text-gray-100 transition-colors duration-200 ease-in-out`,
      `${colorStyle}`,
      'cursor-pointer',
    ]"
  >
    <slot />
  </li>
</template>

<script>
export default {
  /**
   * # TractionMenuItem
   *
   * Tailwind component to display a menu-item/tab-item within TractionMenu.
   * Support for two colors.
   *
   * @example
   * <template>
   *   <div>
   *      <traction-menu :border="true">
   *         <traction-menu-item/>
   *      </traction-menu>
   *   </div>
   * </template>
   */
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
    colorStyle: ({ active, color }) =>
      active
        ? `text-white ${color == 'blue' ? 'bg-sdb-300 ' : 'bg-sp'}`
        : `border-2 border-white text-black bg-gray-200 ${
            color == 'blue' ? ' hover:bg-sdb-300' : 'hover:bg-sp'
          }`,
  },
}
</script>
