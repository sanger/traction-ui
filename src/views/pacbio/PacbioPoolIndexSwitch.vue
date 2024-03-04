<template>
  <flagged-feature name="multiplexing_phase_2_aliquot">
    <template #disabled>
      <PacbioPoolIndexV1 />
    </template>
    <PacbioPoolIndex />
  </flagged-feature>
</template>

<script>
import PacbioPoolIndex from '@/views/pacbio/PacbioPoolIndex.vue'
import PacbioPoolIndexV1 from '@/views/pacbio/PacbioPoolIndexV1.vue'
export default {
  components: {
    PacbioPoolIndex,
    PacbioPoolIndexV1,
  },
}
</script>
