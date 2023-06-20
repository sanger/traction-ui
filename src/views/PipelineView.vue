<template>
  <div class="flex flex-col justify-start">
    <traction-menu :border="true"
      ><traction-menu-item
        v-for="(pipelineRoute, index) in pipelineInfo.routes"
        :key="index"
        :active="isActive(pipelineRoute)"
        color="blue"
        @click.native="setSource(index)"
        >{{ humanise(pipelineRoute) }}</traction-menu-item
      >
    </traction-menu>
    <router-view class="mt-2"></router-view>
  </div>
</template>

<script>
import PipelinesConfig from '@/config/PipelinesConfig'
import { humanise } from '@/lib/stringHumanisation'
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter
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
    /** Callback handler for tab item selection - Each tab selection navigates user to a different page which
     * is handled by the router.push method**/
    setSource(indx) {
      this.sourceIndex = indx
      this.$router.push({ path: this.path(this.pipelineInfo.routes[indx]) }).catch((error) => {
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

<style scoped land="scss">
a {
  color: black;
}
</style>
