<template>
  <div class="flex flex-col justify-start">
    <traction-menu :border="true"
      ><traction-menu-item
        v-for="(pipelineRoute, index) in pipelineInfo.routes"
        :key="index"
        :active="index == sourceIndex"
        color="blue"
        @click.native="setSource(index)"
        >{{ humanise(pipelineRoute) }}</traction-menu-item
      >
    </traction-menu>
    <router-view class="mt-8"></router-view>
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
    path(route) {
      return '/' + this.pipelineInfo.name + '/' + route
    },
    setSource(indx) {
      this.sourceIndex = indx
      this.$router.push({ path: this.path(this.pipelineInfo.routes[indx]) }).catch((error) => {
        if (!isNavigationFailure(error, NavigationFailureType.duplicated)) {
          console.error(error)
        }
      })
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
