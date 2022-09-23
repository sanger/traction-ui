<template>
  <div class="flex flex-col">
    <div class="flex flex-row">
      <slot />
      <div v-if="withIcon" class="flex ml-1 items-center justify-center">
        <traction-fail-icon v-if="error.length" class="inline-block w-4 h-4 text-red-400" />
        <traction-pass-icon v-else class="inline-block w-4 h-4 text-green-600" />
      </div>
    </div>
    <div
      v-if="error.length"
      class="text-left ml-1 text-red-400 mt-1 text-xxs"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
import TractionPassIcon from './icons/TractionPassIcon.vue'
import TractionFailIcon from './icons/TractionFailIcon.vue'
export default {
  name: 'TractionFieldError',
  components: { TractionPassIcon, TractionFailIcon },
  props: {
    error: {
      type: String,
      default: '',
    },
    withIcon: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
