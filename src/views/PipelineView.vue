<template>
  <div>
    <p> {{ pipelineInfo.title }} </p>
    <b-card>
      <b-card-header header-tag="nav">
        <b-nav tabs fill>
          <b-nav-item v-for="(route, index) in pipelineInfo.routes" v-bind:key="index" :to="path(route)">{{ capitalizeFirstLetter(route) }}</b-nav-item>
        </b-nav>
      </b-card-header>

      <b-card-body> 
        <router-view></router-view>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>

import PipelinesConfig from '@/config/PipelinesConfig'
import Helper from '@/mixins/Helper'

export default {
  name: 'PipelineView',
  mixins: [Helper],
  computed: {
    pipelineInfo () {
      let pipeline = localStorage.getItem('pipeline')
      return PipelinesConfig.find(p => p.name == pipeline)
    }
  },
  methods: {
    path(route) {
      return '/'+this.pipelineInfo.name+'/'+route
    }
  }
}

</script>

<style scoped land="scss">
  a {
    color: black;
  }
</style>