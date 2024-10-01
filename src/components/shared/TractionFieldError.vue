<template>
  <div class="flex flex-col">
    <div class="flex flex-row">
      <slot />
      <div
        v-if="withIcon"
        class="flex ml-1 items-center justify-center"
        :data-attribute="dataAttribute + '-icon'"
      >
        <traction-result-icon :result="`${error.length ? 'fail' : 'pass'}`" />
      </div>
    </div>
    <div
      v-if="error.length"
      :class="`text-left ml-1 text-failure mt-1 text-xs ${classes} whitespace-normal min-h-7`"
      :data-attribute="dataAttribute"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
import TractionResultIcon from '@/components/shared/icons/TractionResultIcon.vue'
export default {
  name: 'TractionFieldError',
  components: {
    TractionResultIcon,
  },
  props: {
    error: {
      type: String,
      default: '',
    },
    dataAttribute: {
      type: String,
      default: '',
    },
    /**If enabled - displays a tick icon next to child if there is no error , other wise a cross icon */
    withIcon: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: '',
    },
  },
}
</script>
