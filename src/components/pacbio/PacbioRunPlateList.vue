<template>
  <traction-section title="Plates" class="min-w-[500px]">
    <div class="flex flex-row w-full">
      <PacbioRunPlateItem
        v-for="plateNumber in store.getPlateList.length"
        :key="plateNumber"
        :plate-number="plateNumber"
        class="w-full"
      />
    </div>
  </traction-section>
</template>
<script setup>
/**
 * PacbioRunPlateList component
 * This component displays a list of PacbioRunPlateItem components for each plate in the store.
 * It uses the PacbioRunPlateItem component to display the plate.
 * It uses the usePacbioRunCreateStore store to get the plate list.
 */
import PacbioRunPlateItem from '@/components/pacbio/PacbioRunPlateItem.vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'

const store = usePacbioRunCreateStore()
</script>
