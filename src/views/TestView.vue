<template>
    <div class="max-w-[750px]">
        <labware-map
            v-slot="{ position, interactive }"
            name="96-well plate"
            :num-rows=8
            :num-columns=12
            :interactive=true
        >
            <PacbioRunWell :position="position" :interactive="interactive"/>
        </labware-map>
    </div>
</template>
<script setup>
import labwareMap from '@/components/labware/LabwareMap.vue'
import PacbioRunWell from '@/components/labware/PacbioRunWell.vue'
</script>