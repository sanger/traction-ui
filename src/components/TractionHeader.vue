<template>
  <div :class="headerClasses">
    <div class="max-w-7xl mx-auto px-4 flex flex-row justify-between">
      <div class="flex justify-between items-center py-4 md:justify-start md:space-x-10">
        <div class="flex flex-row gap-x-4 items-center">
          <router-link to="/" class="flex-none">
            <img class="w-10 h-10" src="../images/traction-logo.svg" alt="Traction logo" />
          </router-link>
          <button
            v-for="pipeline in pipelines"
            :key="pipeline.name"
            :data-attribute="`${pipeline.name}-menu`"
            type="button"
            :class="[
              'relative inline-flex w-24 shrink-0 self-stretch items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none hover:text-white cursor-pointer',
              openPipeline?.name === pipeline.name
                ? [
                    'text-white',
                    // This is mainly for the smoothing into the sub nav-bar
                    'before:content-[\'\'] before:absolute before:-bottom-4 before:size-[6px] before:pointer-events-none before:bg-black/10 before:left-[-6px] before:[mask-image:radial-gradient(circle_at_top_left,transparent_6px,black_6px)]',
                    'after:content-[\'\'] after:absolute after:-bottom-4 after:size-[6px] after:pointer-events-none after:bg-black/10 after:right-[-6px] after:[mask-image:radial-gradient(circle_at_top_right,transparent_6px,black_6px)]',
                  ]
                : 'text-gray-400',
            ]"
            @click="toggle(pipeline)"
          >
            <span
              v-if="openPipeline?.name === pipeline.name"
              aria-hidden="true"
              class="pointer-events-none absolute inset-x-0 top-0 -bottom-4 rounded-t-md bg-black/10"
            />
            <span class="relative">{{ pipeline.title }}</span>
          </button>
          <button
            type="button"
            data-attribute="tools-menu"
            :class="[
              'relative inline-flex w-24 shrink-0 self-stretch items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none hover:text-white cursor-pointer',
              toolsOpen
                ? [
                    'text-white',
                    'before:content-[\'\'] before:absolute before:-bottom-4 before:size-[6px] before:pointer-events-none before:bg-black/10 before:left-[-6px] before:[mask-image:radial-gradient(circle_at_top_left,transparent_6px,black_6px)]',
                    'after:content-[\'\'] after:absolute after:-bottom-4 after:size-[6px] after:pointer-events-none after:bg-black/10 after:right-[-6px] after:[mask-image:radial-gradient(circle_at_top_right,transparent_6px,black_6px)]',
                  ]
                : 'text-gray-400',
            ]"
            :aria-expanded="toolsOpen"
            aria-controls="tools-dropdown"
            @click="toggleTools"
          >
            <span
              v-if="toolsOpen"
              aria-hidden="true"
              class="pointer-events-none absolute inset-x-0 top-0 -bottom-4 rounded-t-md bg-black/10"
            />
            <span class="relative">Tools</span>
          </button>
        </div>
      </div>
      <TractionSessionButton />
    </div>
    <div v-if="openPipeline" data-attribute="pipeline-dropdown" class="bg-black/10">
      <div ref="optionsRow" class="relative flex flex-row flex-wrap gap-x-2 py-2">
        <router-link
          v-for="pipelineRoute in openPipeline.routes"
          :key="pipelineRoute"
          :data-route="`/${openPipeline.name}/${pipelineRoute}`"
          :to="`/${openPipeline.name}/${pipelineRoute}`"
          :class="[
            'px-4 py-1 rounded-md text-sm font-medium hover:text-white',
            $route.path === `/${openPipeline.name}/${pipelineRoute}`
              ? 'text-white'
              : 'text-gray-300',
          ]"
          >{{ humanise(pipelineRoute) }}</router-link
        >
        <span
          v-if="underline.visible"
          data-attribute="pipeline-underline"
          class="absolute bottom-0 bg-white transition-all duration-300 ease-in-out"
          :style="{ left: `${underline.left}px`, width: `${underline.width}px`, height: '2px' }"
        />
      </div>
    </div>
    <div v-if="toolsOpen" id="tools-dropdown" data-attribute="tools-dropdown" class="bg-black/10">
      <div class="max-w-7xl mx-auto px-4 py-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <router-link
            v-for="tool in tools"
            :key="tool.link"
            :to="tool.link"
            class="flex items-start gap-3 rounded-md p-3 text-gray-200 hover:bg-black/10 hover:text-white"
            @click="toolsOpen = false"
          >
            <component
              :is="tool.icon"
              :data-icon="tool.iconName"
              v-bind="tool.fill ? { fill: tool.fill } : {}"
              class="mt-0.5 h-6 w-6 shrink-0"
              aria-hidden="true"
            />
            <span class="flex flex-col">
              <span class="text-sm font-medium">{{ tool.name }}</span>
              <span class="text-xs text-gray-300">{{ tool.description }}</span>
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { humanise } from '@/lib/stringHumanisation'
import { bgColorClass } from '@/lib/BgColorClass'
import PipelinesConfig from '@/config/PipelinesConfig'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'
import ConicalFlaskIcon from '@/icons/ConicalFlaskIcon.vue'
import DownloadIcon from '@/icons/DownloadIcon.vue'
import GeneticsIcon from '@/icons/GeneticsIcon.vue'
import TubeIcon from '@/icons/TubeIcon.vue'
import UploadIcon from '@/icons/UploadIcon.vue'
import TractionSessionButton from './TractionSessionButton.vue'

const route = useRoute()
const pipelines = PipelinesConfig.filter((p) => p.active)
const toggled = ref(null)
const toolsOpen = ref(false)
const optionsRow = ref(null)
const underline = ref({ visible: false, left: 0, width: 0 })
const tools = [
  {
    name: 'Reception',
    link: '/reception',
    description: 'Receive samples and libraries into Traction',
    icon: GeneticsIcon,
    iconName: 'genetics',
  },
  {
    name: 'LabWhere Reception',
    link: '/labwhere-reception',
    description: 'Update labware locations in LabWhere',
    icon: ConicalFlaskIcon,
    iconName: 'conical-flask',
  },
  {
    name: 'Label Printing',
    link: '/label-printing',
    description: 'Print labels for labware',
    icon: BarcodeIcon,
    iconName: 'barcode',
    fill: '#fff',
  },
  {
    name: 'QC Results Upload',
    link: '/qc-results-upload',
    description: 'Upload quality control results',
    icon: UploadIcon,
    iconName: 'upload',
  },
  {
    name: 'Sample Report',
    link: '/sample-report',
    description: 'View and download sample reports',
    icon: DownloadIcon,
    iconName: 'download',
  },
  {
    name: 'Flexible Pooling',
    link: '/flexible-pooling',
    description: 'Create multiple pools at the same time',
    icon: TubeIcon,
    iconName: 'tools',
  },
]

// Determine the active pipeline based on the current route
const activePipeline = computed(() =>
  pipelines.find((pipeline) => pipeline.name === route.path.split('/')[1]),
)
// Stays open on a pipeline's own pages; a clicked button previews another pipeline
const openPipeline = computed(() =>
  toolsOpen.value ? null : toggled.value || activePipeline.value,
)

const toggleTools = () => {
  toolsOpen.value = !toolsOpen.value
  toggled.value = null
}

// Toggle the open pipeline
const toggle = (pipeline) => {
  toolsOpen.value = false
  if (activePipeline.value?.name === pipeline.name) {
    toggled.value = null
  } else {
    toggled.value = toggled.value?.name === pipeline.name ? null : pipeline
  }
}

// Slide the underline under the link for the current page
const updateUnderline = async () => {
  await nextTick()
  const link = optionsRow.value?.querySelector(`[data-route="${route.path}"]`)
  underline.value = link
    ? { visible: true, left: link.offsetLeft, width: link.offsetWidth }
    : { ...underline.value, visible: false }
}
watch(
  () => route.path,
  () => {
    toggled.value = null
    toolsOpen.value = false
  },
)
watch(() => [route.path, openPipeline.value], updateUnderline, {
  immediate: true,
  flush: 'post',
})

const environment = import.meta.env['VITE_ENVIRONMENT']
const headerClasses = ['relative', bgColorClass[environment]]
</script>
