<template>
  <traction-section title="Plates" class="min-w-[500px]">
    <div class="flex flex-row w-full">
      <PacbioRunPlateItem v-for="plateNumber in instrumentType.plateCount" :key="plateNumber" :plateNumber="plateNumber" class="w-full" />
    </div>
  </traction-section>
</template>

<script>
import PacbioRunPlateItem from '@/components/pacbio/PacbioRunPlateItem.vue'
import { mapGetters } from 'vuex'

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
    ...mapGetters('traction/pacbio/runCreate', ['instrumentType']),
  },
}
</script>
