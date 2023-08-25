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
  @apply inline-flex items-center rounded-lg px-1 py-0 my-1 text-xs font-medium;
}
/* colours defined here to assist dynamic rendering */
.badge-gray {
  @apply bg-gray-200 text-gray-600;
}
.badge-red {
  @apply bg-red-200 text-red-700;
}
.badge-yellow {
  @apply bg-yellow-300 text-yellow-700;
}
.badge-green {
  @apply bg-green-200 text-green-700;
}
.badge-blue {
  @apply bg-blue-200 text-blue-700;
}
.badge-indigo {
  @apply bg-indigo-200 text-indigo-700;
}
.badge-purple {
  @apply bg-purple-200 text-purple-700;
}
.badge-pink {
  @apply bg-pink-200 text-pink-700;
}
</style>
