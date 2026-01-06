<template>
  <div :class="headerClasses">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center py-4 md:justify-start md:space-x-10">
        <div class="flex flex-row gap-x-2 items-center">
          <router-link to="/" class="flex-none gap-x-2">
            <img class="w-10 h-10" src="../images/traction-logo.svg" alt="Traction logo" />
          </router-link>
          <TractionLink name="Label Printing" link="/label-printing" view-type="2" />
          <TractionLink name="QC Results Upload" link="/qc-results-upload" view-type="2" />
          <TractionLink name="Reception" link="/reception" view-type="2" />
          <TractionLink name="LabWhere Reception" link="/labwhere-reception" view-type="2" />
          <TractionLink name="Sample Report" link="/sample-report" view-type="2" />
          <FlaggedFeature name="batch_pooling">
            <TractionLink name="Batch Pooling" link="/batch-pooling" view-type="2" />
          </FlaggedFeature>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TractionLink from '@/components/TractionLink'
import { bgColorClass } from '@/lib/BgColorClass'
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'

const environment = import.meta.env['VITE_ENVIRONMENT']
const headerClasses = ['relative', bgColorClass[environment]]
</script>
