<template>
  <div class="display-contents">
    <slot v-if="enabled"></slot>
    <slot v-else name="disabled"></slot>
  </div>
</template>

<script>
import useSWRV from 'swrv'
const DEFAULT_FEATURE = { enabled: false }

/**
 * # Flagged Feature
 *
 * This component provides a means of wrapping content that will be displayed
 * based on the state of a feature flag persisted in traction-service.
 *
 * @example
 * <template>
 *   <div>
 *     <flagged-feature name="my_feature">
 *       Content to display when enabled

 *       <template #disabled>Optional tag to render when disabled</template>
 *     </flagged-feature>
 *   </div>
 * </template>
 */
export default {
  name: 'FlaggedFeature',
  props: {
    name: {
      // The name of the feature flag on which to flip this
      type: String,
      required: true,
    },
  },
  setup() {
    const baseURL = import.meta.env.VITE_TRACTION_BASE_URL
    const { data, error } = useSWRV(`${baseURL}/flipper/api/actors/User`)
    return {
      data,
      error,
    }
  },
  computed: {
    feature() {
      return this.data?.features[this.name] || DEFAULT_FEATURE
    },
    enabled() {
      return this.feature.enabled
    },
  },
}
</script>

<style scoped>
.display-contents {
  display: contents;
}
</style>
