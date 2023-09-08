<template>
  <span
    :class="[
      'badge', // badge class added for easy testing
      'inline-flex items-center',
      'rounded-lg px-1 py-0 my-1 text-xs font-medium',
      colorStyle,
    ]"
  >
    <slot />
  </span>
</template>

<script>
import { within } from '@/lib/propValidations'

const colorClasses = {
  black: 'bg-black text-gray-300',
  white: 'bg-white text-gray-800',
  gray: 'bg-gray-200 text-gray-700',
  red: 'bg-red-200 text-red-800',
  orange: 'bg-orange-300 text-orange-800',
  yellow: 'bg-yellow-300 text-yellow-800',
  green: 'bg-green-200 text-green-800',
  teal: 'bg-teal-200 text-teal-800',
  blue: 'bg-blue-200 text-blue-800',
  indigo: 'bg-indigo-200 text-indigo-800',
  purple: 'bg-purple-200 text-purple-800',
  pink: 'bg-pink-200 text-pink-800',
  sdb: 'bg-sdb-200 text-gray-300',
  'sanger-dark-blue': 'bg-sdb-200 text-gray-300',
  sp: 'bg-sp-400 text-white',
  'sanger-pink': 'bg-sp-400 text-white',
  success: 'bg-success-dark text-success-light',
  warning: 'bg-warning-dark text-warning-light',
  failure: 'bg-failure-dark text-failure-light',
}

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
      validator: within(...Object.keys(colorClasses)),
    },
  },
  computed: {
    colorStyle: ({ color }) => colorClasses[color],
  },
}
</script>
