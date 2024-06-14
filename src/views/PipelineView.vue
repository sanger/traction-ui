<template>
  <div class="flex flex-col justify-start">
    <traction-menu :border="true"
      ><traction-menu-item
        v-for="(pipelineRoute, index) in this.sortedRoutes"
        :key="index"
        :active="isActive(pipelineRoute)"
        color="blue"
        @click="setSource(index)"
        >{{ humanise(pipelineRoute) }}</traction-menu-item
      >
    </traction-menu>
    <router-view class="mt-2" />
  </div>
</template>

<script>
import PipelinesConfig from '@/config/PipelinesConfig'
import { humanise } from '@/lib/stringHumanisation'
import { isNavigationFailure, NavigationFailureType } from 'vue-router'
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
    sortedRoutes() {
      return this.pipelineInfo.routes.toSorted()
    },
  },
  methods: {
    /**This method returns the relative path to navigate to while clicking on a pipeline menu item*/
    path(route) {
      return '/' + this.pipelineInfo.name + '/' + route
    },
    /** Callback handler for tab item selection - Each tab selection navigates user to a different page which
     * is handled by the router.push method**/
    setSource(index) {
      this.sourceIndex = index
      // If new tab is already active, do nothing
      if (this.isActive(this.sortedRoutes[index])) {
        return
      }
      this.$router.push({ path: this.path(this.sortedRoutes[index]) }).catch((error) => {
        if (!isNavigationFailure(error, NavigationFailureType.duplicated)) {
          console.error(error)
        }
      })
    },
    isActive(pipelineRoute) {
      return this.$route.path === this.path(pipelineRoute)
    },
    humanise,
  },
}
</script>
