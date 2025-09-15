<template>
  <div class="contents">
    <slot v-if="enabled"></slot>
    <slot v-else name="disabled"></slot>
  </div>
</template>

<script setup>
/**
 * # Flagged Feature
 *
 * This component provides a means of wrapping content that will be displayed
 * based on the state of a feature flag persisted in traction-service.
 *
 * When testing in cypress you can mock flag responses:
 *
 * @example
 *   beforeEach(() => {
 *   cy.withFlags({
 *     dpl_277_enable_general_reception: { enabled: true },
 *   })
 * })
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

import { computed, ref, onMounted } from 'vue'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'

const rootStore = useRootStore()
const data = ref(null)

const DEFAULT_FEATURE = { enabled: false }

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

onMounted(async () => {
  const request = rootStore.api.traction.feature_flags
  const promise = request.get()
  const { success, body } = await handleResponse(promise)
  if (success) {
    data.value = body
  }
})

const feature = computed(() => data.value?.features?.[props.name] || DEFAULT_FEATURE)
const enabled = computed(() => feature.value.enabled)
</script>
