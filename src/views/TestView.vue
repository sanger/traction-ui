<template>
    <div class="max-w-[750px]">
        <labware-map
            name="96-well plate"
            :num-rows=8
            :num-columns=12
        />
    </div>
</template>
<script setup>
import labwareMap from '@/components/labware/LabwareMap.vue'
</script>