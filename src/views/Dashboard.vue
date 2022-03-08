<template>
  <div>
    <b-card-group deck>
      <b-card
        v-for="(pipeline, index) in pipelines"
        :key="index"
        :title="pipeline.title"
        tag="article"
        style="margin: auto 10"
        :class="pipeline.name"
      >
        <b-card-text>
          {{ pipeline.description }}
        </b-card-text>

        <router-link
          v-for="(route, inner_index) in pipeline.routes"
          :key="inner_index"
          :to="{ path: `/${pipeline.name}/${route}` }"
        >
          <b-button variant="outline-primary">{{ humanise(route) }}</b-button>
        </router-link>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import PipelinesConfig from '@/config/PipelinesConfig'
import { humanise } from '@/lib/stringHumanisation'

export default {
  name: 'Dashboard',
  computed: {
    pipelines: () => PipelinesConfig,
  },
  methods: {
    humanise,
  },
}
</script>

<style scoped lang="scss"></style>
