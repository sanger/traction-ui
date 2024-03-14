<template>
  <flagged-feature name="multiplexing_phase_2_aliquot">
    <template #disabled>
      <PacbioPoolCreateV1 />
    </template>
    <PacbioPoolCreate />
  </flagged-feature>
</template>

<script>
/**
 * This component is used to toggle between PacbioPoolCreate and PacbioPoolCreateV1 based on the feature flag 'multiplexing_phase_2_aliquot'.
 * If the feature flag is enabled, it will render PacbioPoolCreateV1 component, else it will render PacbioPoolCreate component.
 * TODO:
 * Once the feature flag is removed, this component can be removed from the codebase.
 */
import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate.vue'
import PacbioPoolCreateV1 from '@/views/pacbio/PacbioPoolCreateV1.vue'
export default {
  components: {
    PacbioPoolCreate,
    PacbioPoolCreateV1,
  },
}
</script>