<template>
  <button
    :class="[
      'w-full inline-flex justify-center rounded-md border border-transparent',
      'px-4 py-2 font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'sm:mt-0 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50',
      themeStyle,
      sizeStyle,
      widthStyle,
    ]"
    @click="click"
  >
    <slot />
  </button>
</template>

<script>
/**
 * Provides a simple themed button.
 *
 * Theme: Specifies the role of the button, and thus the styling that will be applied.
 *
 *   default: Uses the secondary colour, good fallback when the role isn't clear
 *   accent: Uses the accent colour (Bright pink at time of writing) Makes no
 *   assumption about the role of the button. Be cautious with use, as could be
 *   confused with red.
 *   create: Green, used when the action will create something.
 *   edit: As default, for buttons that take you to an edit page, but don't
 *   themselves result in any chanhges
 *   update: Orange: Used for actions that mutate a resource
 *   delete: Red, used for destructive events
 *   print: Blue, used for any actions that will send something to the printer.
 *   reset: As default, Resets the current form
 *   cancel: As default, Cancels the current action (without side-effects)
 *   *SHOULD* not be used for cancel actions with side effects. (Like cancelling
 *   a run)
 *
 */
import { within } from '@/lib/propValidations'

const themes = {
  default: 'text-white bg-sdb-400 hover:bg-sdb active:bg-sdb-600',
  accent: 'text-white bg-sp hover:bg-sp-400 active:bg-sp-600',
  create: 'text-white bg-green-500 hover:bg-green-400 active:bg-green-600',
  update: 'text-white bg-orange-500 hover:bg-orange-400 active:bg-orange-600',
  delete: 'text-white bg-red-500 hover:bg-red-400 active:bg-red-600',
  print: 'text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-600',
  // Currently same as default
  edit: 'text-white bg-sdb-400 hover:bg-sdb active:bg-sdb-600',
  reset: 'text-white bg-sdb-400 hover:bg-sdb active:bg-sdb-600',
  cancel: 'text-white bg-sdb-400 hover:bg-sdb active:bg-sdb-600',
  pagination: 'bg-white text-black border-2 border-gray-300 hover:bg-gray-400',
}

export default {
  name: 'TractionButton',
  props: {
    theme: {
      type: String,
      default: 'default',
      required: false,
      validator: within(...Object.keys(themes)),
    },
    size: {
      type: String,
      required: false,
      default: 'md',
      validator: within('sm', 'md', 'lg'),
    },
    fullWidth: {
      // The button fills the full width of the container
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      // Optional prop that causes the button to have navigation properties
      type: [String, Object],
      required: false,
      default: null,
    },
  },
  computed: {
    themeStyle: ({ theme }) => themes[theme],
    sizeStyle: ({ size }) => ({
      'text-sm': size === 'sm',
      'text-base': size === 'md',
      'text-lg': size === 'lg',
    }),
    widthStyle: ({ fullWidth }) => ({
      'sm:w-auto': !fullWidth,
      'w-full': fullWidth,
    }),
  },
  methods: {
    click() {
      if (this.to) {
        this.$router.push(this.to)
      } else {
        this.$emit('click')
      }
    },
  },
}
</script>
