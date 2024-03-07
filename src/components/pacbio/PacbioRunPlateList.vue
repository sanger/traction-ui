<template>
  <traction-section title="Plates" class="min-w-[500px]">
    <div class="flex flex-row w-full">
      <PacbioRunPlateItem
        v-for="plateNumber in getPlateList.length"
        :key="plateNumber"
        :plate-number="plateNumber"
        class="w-full"
      />
    </div>
  </traction-section>
</template>

<script>
import PacbioRunPlateItem from '@/components/pacbio/PacbioRunPlateItem.vue'
import { mapState } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

export default {
  name: 'PacbioRunPlateList',
  components: {
    PacbioRunPlateItem,
  },
  data() {
    return {
      selectedPlate: 1,
    }
  },
  computed: {
    ...mapState(usePacbioRunCreateStore, ['getPlateList']),
  },
}
</script>
