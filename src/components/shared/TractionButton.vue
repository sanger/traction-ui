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
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
/**
 * Provides a simple themed button.
 *
 */
import { within } from '@/lib/propValidations'

// Provides legacy support for old b-button 'variants'
const boostrapToTheme = (bootstrap) =>
  ({
    primary: 'primary',
    danger: 'delete',
    success: 'create',
    'outline-primary': 'primary', // This is definitely not an equivalent mapping
    'outline-success': 'create',
    'outline-danger': 'delete',
    'outline-info': 'default',
    'outline-dark': 'default',
  }[bootstrap])

export default {
  name: 'TractionButton',
  props: {
    theme: {
      type: String,
      default: 'default',
      required: false,
      validator: within('default', 'create', 'primary', 'default', 'print'),
    },
    variant: {
      // Legacy support for bootstrap colour styles
      type: String,
      required: false,
      default: null,
      validator: within(
        'primary',
        'danger',
        'success',
        'outline-primary',
        'outline-success',
        'outline-danger',
        'outline-info',
        'outline-dark',
      ),
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
  },
  computed: {
    _theme: ({ theme, variant }) => (variant ? boostrapToTheme(variant) : theme),
    themeStyle: ({ _theme }) => ({
      'text-white bg-sdb-400 hover:bg-sdb active:bg-sdb-600': _theme === 'default',
      'text-white bg-green-500 hover:bg-green-400 active:bg-green-600': _theme === 'create',
      'text-white bg-sp hover:bg-sp-400 active:bg-sp-600': _theme === 'primary',
      'text-white bg-red-500 hover:bg-red-400 active:bg-red-600': _theme === 'delete',
      'text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-600': _theme === 'print',
    }),
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
}
</script>
