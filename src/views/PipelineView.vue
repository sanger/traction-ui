<template>
  <div class="flex flex-col justify-start">
    <div class="flex flex-row border-b-2 border-gray-200">
      <span class="text-2xl pr-4 text-gray-400 text-light">{{ pipelineInfo.title }}</span>
      <traction-menu>
        <div v-for="(pipelineRoute, index) in pipelineInfo.routes" :key="index" class="flex">
          <router-link
            v-if="!isActive(pipelineRoute)"
            :class="routeClass(pipelineRoute)"
            :to="`/${pipelineInfo.name}/${pipelineRoute}`"
            >{{ humanise(pipelineRoute) }}
          </router-link>
          <span v-else :class="routeClass(pipelineRoute)">{{ humanise(pipelineRoute) }} </span>
        </div>
      </traction-menu>
    </div>
    <router-view class="mt-2" />
  </div>
</template>

<script>
import PipelinesConfig from '@/config/PipelinesConfig'
import { humanise } from '@/lib/stringHumanisation'
export default {
  name: 'PipelineView',
  props: {
    pipeline: {
      type: String,
      required: true,
      validator: (value) => PipelinesConfig.find((p) => p.name == value),
    },
  },
  data: () => ({
    sourceIndex: 0,
  }),
  computed: {
    pipelineInfo() {
      return PipelinesConfig.find((p) => p.name == this.pipeline)
    },
  },
  methods: {
    /**This method returns the relative path to navigate to while clicking on a pipeline menu item*/
    path(route) {
      return '/' + this.pipelineInfo.name + '/' + route
    },
    isActive(pipelineRoute) {
      return this.$route.path === this.path(pipelineRoute)
    },
    routeClass(route) {
      return `text-black bg-gray-200 hover:bg-sdb-300 hover:text-white flex
        pl-2 pr-2 p-0 m-0 rounded-t-md
        transition-colors duration-100 ease-in-out cursor-pointer
        ${this.isActive(route) ? 'text-white bg-sdb-300' : 'text-black bg-gray-200 hover:bg-sdb-300'}`
    },
    humanise,
  },
}
</script>
