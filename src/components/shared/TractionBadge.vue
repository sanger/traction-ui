<template>
  <span
    :class="[
      'badge', // badge class added for easy testing
      'inline-flex items-center',
      'rounded-lg px-1 py-0 my-1 text-xs font-medium',
      colourStyle,
    ]"
  >
    <slot />
  </span>
</template>

<script>
import { within } from '@/lib/propValidations'

const colourClasses = {
  grays: {
    black: 'bg-black text-gray-300',
    white: 'bg-white text-gray-800',
    gray: 'bg-gray-200 text-gray-700',
  },
  spectrum: {
    red: 'bg-red-200 text-red-800',
    orange: 'bg-orange-300 text-orange-800',
    yellow: 'bg-yellow-300 text-yellow-800',
    green: 'bg-green-200 text-green-800',
    blue: 'bg-blue-200 text-blue-800',
    purple: 'bg-purple-200 text-purple-800',
  },
  sanger: {
    sdb: 'bg-sdb-200 text-gray-300',
    'sanger-dark-blue': 'bg-sdb-200 text-gray-300',
    sp: 'bg-sp-400 text-white',
    'sanger-pink': 'bg-sp-400 text-white',
    'sanger-green': 'bg-green-400 text-white',
  },
  statuses: {
    success: 'bg-success-dark text-success-light',
    warning: 'bg-warning-dark text-warning-light',
    failure: 'bg-failure-dark text-failure-light',
  },
}

const flatColourClasses = Object.values(colourClasses).reduce((acc, curr) => {
  return { ...acc, ...curr }
}, {})

export default {
  /**
   * # TractionBadge
   *
   * Tailwind component to display a coloured badge with text.
   *
   * The colour can be set using the `color` prop. Available colours
   * are: black, white, gray, red, orange, yellow, green, blue,
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
    colour: {
      type: String,
      default: 'sanger-dark-blue',
      required: false,
      validator: within(...Object.keys(flatColourClasses)),
    },
  },
  computed: {
    colourStyle: ({ colour }) => flatColourClasses[colour],
  },
  // colour lists like {warm: ['red', 'orange', 'yellow'], cool: ['blue', 'indigo', 'violet']}
  colours: Object.keys(colourClasses).reduce((acc, curr) => {
    return { ...acc, [curr]: Object.keys(colourClasses[curr]) }
  }, {}),
}
</script>
