<template>
  <traction-section title="Pools & Libraries">
    <LabwareFinder :fetcher="store.findPoolsOrLibraryByTube" filter="barcode" />
    <div v-for="item in store.tubeContents" :key="item.id" class="pt-2">
      <div v-if="item.type === 'pools'">
        <PoolTube v-bind="item" />
      </div>
      <div v-else-if="item.type === 'libraries'">
        <LibraryTube v-bind="item" />
      </div>
    </div>
  </traction-section>
</template>

<script setup>
import PoolTube from '@/components/pacbio/PacbioPoolTubeItem'
import LibraryTube from '@/components/pacbio/PacbioLibraryTubeItem'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'
import LabwareFinder from '@/components/LabwareFinder'

const store = usePacbioRunCreateStore()
</script>
