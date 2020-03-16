<template>
  <div>
    <b-card-group deck>
      <b-card v-for="(pipeline, index) in pipelines" v-bind:key="index"
          :title="pipeline.title"
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
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
import { mapMutations } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    pipelines () {
      return PipelinesConfig
    }
  },
  methods: {
    ...mapMutations([
      'setPipeline',
    ])
  },
}
</script>

<style scoped lang="scss">
</style>
