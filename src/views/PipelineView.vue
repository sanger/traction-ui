<template>
  <div>
    <b-card>
      <b-card-header header-tag="nav">
        <b-nav tabs fill>
          <b-nav-item v-for="(route, index) in pipelineInfo.routes" v-bind:key="index" :to="route">{{ capitalizeFirstLetter(route) }}</b-nav-item>
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
  }
}

</script>

<style scoped land="scss">
  a {
    color: black;
  }
</style>