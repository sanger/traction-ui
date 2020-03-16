<template>
  <div>
    <b-card-group deck>
      <b-card v-for="(pipeline, index) in pipelines" v-bind:key="index"
          :title="pipeline.title"
          tag="article"
          style="max-width: 20rem;"
          :class="pipeline.name"
      >
        <b-card-text>
          {{ pipeline.description }}
        </b-card-text>
      
        <router-link :to="{ path: '/'+pipeline.name }" tag="a">
          <b-button variant="primary" @click="setPipeline(pipeline.name)">{{ pipeline.title }}</b-button>
        </router-link>

      </b-card>
    </b-card-group>
  </div>
</template>

<script>

import PipelinesConfig from '@/config/PipelinesConfig'

export default {
  name: 'Dashboard',
  computed: {
    pipelines () {
      return PipelinesConfig
    }
  },
  methods: {
    setPipeline(pipeline) {
      localStorage.setItem('pipeline', pipeline)
    }
  },
}
</script>

<style scoped lang="scss">
</style>
