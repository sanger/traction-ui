<template>
  <div
    class="flex flex-row items-center gap-2 p-2 mt-4 mb-4 whitespace-nowrap border border-gray-200 bg-gray-100 gap-y-4 shadow-sm"
  >
    <router-link
      data-testid="backToMultiPool"
      :to="{ name: 'FlexiblePool', params: { id: getRouteId() } }"
      class="text-gray-700"
    >
      <TractionArrowIcon class="inline-block h-4 w-4" />
      <span class="align-middle whitespace-nowrap underline underline-offset-2 font-bold"
        >Back to multi pool</span
      >
    </router-link>
  </div>
  <div class="border border-gray-200 p-4 shadow-md">
    <PacbioPoolCreate :flexible-pool-position="getFlexiblePoolPosition()" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PacbioPoolCreate from './pacbio/PacbioPoolCreate.vue'
const route = useRoute()

/**
 * Gets the route id param, which is the multi pool id
 * @returns {string|number} The multi pool id from the route params
 */
const getRouteId = () => {
  return route.params.id
}

/**
 * Gets the flexible pool position from the route params
 * @returns {string|number} The flexible pool position from the route params
 */
const getFlexiblePoolPosition = () => {
  return route.params.position
}
</script>
