<template>
  <traction-section title="Pools & Libraries">
    <LabwareFinder :fetcher="findPools" filter="barcode" />
    <PacbioPoolSelectedList></PacbioPoolSelectedList>
  </traction-section>
</template>
<script>
import LabwareFinder from '@/components/LabwareFinder'
import PacbioPoolSelectedList from './PacbioPoolSelectedList.vue'
import { mapActions } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'

export default {
  name: 'PacbioPoolList',
  components: {
    LabwareFinder,
    PacbioPoolSelectedList,
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(usePacbioRunCreateStore, ['findPools']),
  },
}
</script>
