<template>
  <traction-section title="Pools & Libraries">
    <LabwareFinder :fetcher="store.findPoolsOrLibrariesByTube" filter="barcode" />
    <div v-for="item in store.tubeContents" :key="item.id" class="pt-2">
      <Tube v-bind="item" />
    </div>
  </traction-section>
</template>

<script setup>
import Tube from '@/components/pacbio/PacbioRunTubeItem.vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'
import LabwareFinder from '@/components/LabwareFinder.vue'

const store = usePacbioRunCreateStore()
</script>
