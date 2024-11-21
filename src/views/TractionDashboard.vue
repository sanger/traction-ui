<template>
  <div>
    <div class="flex flex-col px-4 gap-y-4">
      <div class="flex flex-col text-left pb-4">
        <h1
          class="text-4xl bg-gradient-to-r from-sp-400 to-sdb-400 inline-block text-transparent bg-clip-text w-40"
        >
          Traction
        </h1>
        <span class="text-lg text-gray font-light"
          >Long read LIMS for library prep and sequencing setup</span
        >
      </div>
      <div class="flex flex-col text-left border border-gray-200 rounded-md p-4">
        <h2 class="text-2xl">Pipelines</h2>
        <span class="text-md text-gray font-light"
          >A set of quick links for each sequencing pipeline</span
        >
        <div :class="`grid grid-cols-${pipelines.length} gap-x-8`">
          <LabelledCard
            v-for="(pipeline, index) in pipelines"
            :key="index"
            :title="pipeline.title"
            :description="pipeline.description"
          >
            <!-- Links ordered by user workflow, specified in pipelines config -->
            <TractionLink
              v-for="(route, inner_index) in pipeline.routes"
              :key="inner_index"
              :name="humanise(route)"
              :link="`/${pipeline.name}/${route}`"
            />
          </LabelledCard>
        </div>
      </div>

      <div class="flex flex-col text-left border border-gray-200 rounded-md p-4">
        <h2 class="text-2xl">Tools</h2>
        <span class="text-md text-gray font-light">A set of quick links for Traction tools</span>
        <div class="flex flex-row flex-wrap gap-y-8 gap-x-3 py-8 px-4 text-center">
          <TractionLink
            v-for="route in toolRoutes"
            :key="route"
            :name="humanise(route)"
            :link="`/${route}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PipelinesConfig from '@/config/PipelinesConfig'
import { humanise } from '@/lib/stringHumanisation'
import LabelledCard from '@/components/LabelledCard'
import TractionLink from '@/components/TractionLink'

const toolRoutes = ['label-printing', 'qc-results-upload', 'reception', 'labwhere-reception']
const pipelines = computed(() => PipelinesConfig.filter(({ active }) => active))
</script>
