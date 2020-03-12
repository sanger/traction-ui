<template>
  <div>
    <b-card>
      <b-card-header header-tag="nav">
        <b-nav tabs fill>
          <b-nav-item v-for="(route, index) in pipelineInfo.routes" v-bind:key="index" :to="route">{{ titleise(route) }}</b-nav-item>
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
import { mapGetters } from 'vuex'

export default {
  name: 'PipelineView',
  data () {
    return {
    }
  },
  methods: {
    titleise (s) {
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
  },
  computed: {
    pipelineInfo () {
      return PipelinesConfig.find(p => p.name == this.pipeline())
    },
    ...mapGetters([
      'pipeline'
    ])
  }
}

</script>

<style scoped land="scss">
  a {
    color: black;
  }
</style>