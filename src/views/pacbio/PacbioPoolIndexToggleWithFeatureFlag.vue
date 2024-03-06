<template>
  <flagged-feature name="multiplexing_phase_2_aliquot">
    <template #disabled>
      <PacbioPoolIndexV1 />
    </template>
    <PacbioPoolIndex />
  </flagged-feature>
</template>

<script>
/**
 * This component is used to toggle between PacbioPoolIndex and PacbioPoolIndexV1 based on the feature flag 'multiplexing_phase_2_aliquot'.
 * If the feature flag is enabled, it will render PacbioPoolIndexV1 component, else it will render PacbioPoolIndex component.
 * TODO:
 * Once the feature flag is removed, this component can be removed from the codebase.
 */
import PacbioPoolIndex from '@/views/pacbio/PacbioPoolIndex.vue'
import PacbioPoolIndexV1 from '@/views/pacbio/PacbioPoolIndexV1.vue'
export default {
  components: {
    PacbioPoolIndex,
    PacbioPoolIndexV1,
  },
}
</script>
