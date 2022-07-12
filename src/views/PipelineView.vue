<template>
  <div>
    <traction-card no-body>
      <traction-card-header header-tag="nav">
        <traction-nav tabs fill card-header>
          <traction-nav-item
            v-for="(route, index) in pipelineInfo.routes"
            :key="index"
            :to="path(route)"
            exact
            exact-active-class="active"
            >{{ humanise(route) }}</traction-nav-item
          >
        </traction-nav>
      </traction-card-header>

      <traction-card-body>
        <router-view></router-view>
      </traction-card-body>
    </traction-card>
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
  computed: {
    pipelineInfo() {
      return PipelinesConfig.find((p) => p.name == this.pipeline)
    },
  },
  methods: {
    path(route) {
      return '/' + this.pipelineInfo.name + '/' + route
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
