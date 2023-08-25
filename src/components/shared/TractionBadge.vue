<template>
  <span :class="`badge badge-${color}`">
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
      default: 'blue',
      required: false,
    },
  },
}
</script>
<style scoped>
/* badges */
.badge {
  @apply inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset;
}
.badge-gray {
  @apply bg-gray-100 text-gray-600 ring-gray-500;
}
.badge-red {
  @apply bg-red-100 text-red-700 ring-red-600/25;
}
.badge-yellow {
  @apply bg-yellow-100 text-yellow-800 ring-yellow-600/25;
}
.badge-green {
  @apply bg-green-100 text-green-700 ring-green-600/25;
}
.badge-blue {
  @apply bg-blue-100 text-blue-700 ring-blue-700/25;
}
.badge-indigo {
  @apply bg-indigo-100 text-indigo-700 ring-indigo-700/25;
}
.badge-purple {
  @apply bg-purple-100 text-purple-700 ring-purple-700/25;
}
.badge-pink {
  @apply bg-pink-100 text-pink-700 ring-pink-700/25;
}
</style>
