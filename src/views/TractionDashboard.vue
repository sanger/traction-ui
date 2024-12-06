<template>
  <div>
    <div class="flex flex-col px-4 gap-y-4">
      <div class="flex flex-col text-left">
        <h1
          class="text-4xl bg-gradient-to-r from-sp-400 to-sdb-400 inline-block text-transparent bg-clip-text w-40"
        >
          Traction
        </h1>
        <span class="text-lg text-gray font-light"
          >Long read LIMS for library prep and sequencing setup</span
        >
      </div>
      <div class="flex flex-col text-left border border-gray-200 rounded-md p-4 gap-y-4">
        <button class="flex flex-row" @click="pipelineDropdown = !pipelineDropdown">
          <div class="flex flex-col text-left w-full">
            <div class="flex flex-row items-center gap-x-2">
              <h2 class="text-2xl">Pipelines</h2>
              <TractionGeneticsIcon></TractionGeneticsIcon>
            </div>
            <span class="text-md text-gray font-light"
              >A set of quick links for each sequencing pipeline</span
            >
          </div>
          <TractionArrowIcon class="inline-block h-6 w-6" direction="down" />
        </button>
        <div
          :class="`grid grid-cols-${pipelines.length} gap-x-8 ${pipelineDropdown ? 'show' : 'hidden'}`"
        >
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

      <div class="flex flex-col text-left border border-gray-200 rounded-md p-4 gap-y-4">
        <button class="flex flex-row" @click="toolDropdown = !toolDropdown">
          <div class="flex flex-col text-left w-full">
            <div class="flex flex-row items-center gap-x-2">
              <h2 class="text-2xl">Tools</h2>
              <TractionToolsIcon></TractionToolsIcon>
            </div>
            <span class="text-md text-gray font-light"
              >A set of quick links for Traction tools</span
            >
          </div>
          <TractionArrowIcon class="inline-block h-6 w-6" direction="down" />
        </button>
        <div
          :class="`z-10 flex flex-row flex-wrap gap-y-4 gap-x-4 text-center ${toolDropdown ? 'show' : 'hidden'}`"
        >
          <TractionLink
            v-for="route in toolRoutes"
            :key="route"
            :name="humanise(route)"
            :link="`/${route}`"
          />
        </div>
      </div>

      <div class="flex flex-col border border-gray-200 rounded-md p-4 gap-y-4">
        <button class="flex flex-row" @click="docDropdown = !docDropdown">
          <div class="flex flex-col text-left w-full">
            <div class="flex flex-row items-center gap-x-2">
              <h2 class="text-2xl">Documentation</h2>
              <TractionDocsIcon></TractionDocsIcon>
            </div>
            <span class="text-md text-gray font-light"
              >A set of (external) links for Traction documentation</span
            >
          </div>
          <TractionArrowIcon class="inline-block h-6 w-6" direction="down" />
        </button>
        <div
          :class="`z-10 flex flex-row flex-wrap gap-y-4 gap-x-4 text-center ${docDropdown ? 'show' : 'hidden'}`"
        >
          <a
            v-for="doc in docRoutes"
            :key="doc.name"
            :href="doc.link"
            target="_blank"
            class="flex w-32 h-20 p-2 justify-center items-center rounded-md border border-gray-200 text-sm font-sm hover:bg-gray-100 shadow-sm"
          >
            {{ doc.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import PipelinesConfig from '@/config/PipelinesConfig'
import { humanise } from '@/lib/stringHumanisation'
import LabelledCard from '@/components/LabelledCard'
import TractionLink from '@/components/TractionLink'
import TractionDocsIcon from '@/icons/DocsIcon.vue'
import TractionToolsIcon from '@/icons/ToolsIcon.vue'
import TractionGeneticsIcon from '@/icons/GeneticsIcon.vue'

const docRoutes = [
  {
    name: 'Volume tracking',
    link: 'https://sanger.github.io/traction-ui/volume-tracking/',
  },
  {
    name: 'Multiplexing',
    link: 'https://sanger.github.io/traction-service/multiplexing/',
  },
  {
    name: 'SMRT Link Versioning',
    link: 'https://sanger.github.io/traction-service/smrt-link-versioning/',
  },
  {
    name: 'Traction service',
    link: 'https://sanger.github.io/traction-service/',
  },
]
const docDropdown = ref(false)
const toolDropdown = ref(false)
const pipelineDropdown = ref(true)
const toolRoutes = ['label-printing', 'qc-results-upload', 'reception', 'labwhere-reception']
const pipelines = computed(() => PipelinesConfig.filter(({ active }) => active))
</script>
