<template>
    <traction-section title="Pools & Libraries">
        <LabwareFinder :fetcher="store.findPoolsOrLibraryByTube" filter="barcode" />
        <PacbioPoolSelectedList></PacbioPoolSelectedList>
        <div v-for="library in store.librariesArray" :key="library.id">
            {{ library }}
        </div>
    </traction-section>
</template>
<script setup>
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'
import LabwareFinder from '@/components/LabwareFinder'
import PacbioPoolSelectedList from './PacbioPoolSelectedList.vue'

const store = usePacbioRunCreateStore()

</script>