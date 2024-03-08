<template>
  <flagged-feature :name="feature">
    <template #disabled>
      <component :is="componentOnFeatureDisable"></component>
    </template>
    <component :is="componentOnFeatureEnable"></component>
  </flagged-feature>
</template>

<script setup>
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'
/**
 * # Flagged Feature View
 * This component provides a means of toggling content that will be displayed based on the state of a feature flag persisted in traction-service.
 * @example
 *  <flagged-feature-view :componentOnFeatureEnable="component1" :componentOnFeatureDisable="component2" feature="my_feature"></flagged-feature-view>
 */
defineProps({
  componentOnFeatureEnable: { type: [String, Object], required: true }, // The component to render when the feature is enabled
  componentOnFeatureDisable: { type: [String, Object], required: true }, // The component to render when the feature is disabled
  feature: { type: String, required: true },
})
</script>
