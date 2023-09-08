<template>
  <span
    :class="[
      'badge', // badge class added for easy testing
      'inline-flex items-center',
      'rounded-lg px-1 py-0 my-1 text-xs font-medium',
      badgeColor,
    ]"
  >
    <slot />
  </span>
</template>

<script>
export default {
  /**
   * # TractionBadge
   *
   * Tailwind component to display a coloured badge with text.
   *
   * The colour can be set using the `color` prop. Available colours
   * are: black, white, gray, red, orange, yellow, green, teal, blue,
   * indigo, purple, pink, sdb, sanger-dark-blue, sp, sanger-pink,
   * success, warning, failure.
   *
   * If no colour is specified, the default is sanger-dark-blue.
   *
   * @example
   * <template>
   *   <div>
   *      <traction-badge>
   *        Badge Text
   *      </traction-badge>
   *   </div>
   * </template>
   */
  name: 'TractionBadge',
  props: {
    color: {
      type: String,
      default: 'sanger-dark-blue',
      required: false,
    },
  },
  computed: {
    badgeColor: ({ color }) => ({
      'bg-black text-gray-300': color === 'black',
      'bg-white text-gray-800': color === 'white',
      'bg-gray-200 text-gray-700': color === 'gray',
      'bg-red-200 text-red-800': color === 'red',
      'bg-orange-300 text-orange-800': color === 'orange',
      'bg-yellow-300 text-yellow-800': color === 'yellow',
      'bg-green-200 text-green-800': color === 'green',
      'bg-teal-200 text-teal-800': color === 'teal',
      'bg-blue-200 text-blue-800': color === 'blue',
      'bg-indigo-200 text-indigo-800': color === 'indigo',
      'bg-purple-200 text-purple-800': color === 'purple',
      'bg-pink-200 text-pink-800': color === 'pink',
      'bg-sdb-200 text-gray-300': color === 'sdb' || color === 'sanger-dark-blue',
      'bg-sp-400 text-white': color === 'sp' || color === 'sanger-pink',
      'bg-success-dark text-success-light': color === 'success',
      'bg-warning-dark text-warning-light': color === 'warning',
      'bg-failure-dark text-failure-light': color === 'failure',
    }),
  },
}
</script>
