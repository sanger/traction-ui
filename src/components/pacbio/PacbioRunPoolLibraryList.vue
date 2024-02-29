<template>
  <traction-section title="Pools & Libraries">
    <LabwareFinder :fetcher="store.findPoolsOrLibraryByTube" filter="barcode" />
    <div v-for="item in store.tubeContents" :key="item.id" class="pt-2">
      <Tube v-bind="item" />
    </div>
  </traction-section>
</template>

<script setup>
import Tube from '@/components/pacbio/PacbioRunTubeItem'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'
import LabwareFinder from '@/components/LabwareFinder'

const store = usePacbioRunCreateStore()
</script>
