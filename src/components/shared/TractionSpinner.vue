<template>
  <svg
    id="traction-spinner"
    :class="['animate-spin text-sdb', classes]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      fill="#353a64"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
</template>

<script>
/**
 * Renders a spinning, h-5 by w-5, Sanger dark-blue loading icon. All class names can be overridden.
 * @props classes - classeNames to merge with defaults for the svg icon
 *
 */
export default {
  name: 'TractionSpinner',
  props: {
    classes: {
      type: String,
      default: '',
    },
  },
}
</script>
