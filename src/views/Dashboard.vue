<template>
  <div>
    <b-card-group deck>
      <b-card
        v-for="(pipeline, index) in pipelines"
        :key="index"
        :title="pipeline.title"
        tag="article"
        style="max-width: 20rem"
        :class="pipeline.name"
      >
        <b-card-text>
          {{ pipeline.description }}
        </b-card-text>

        <router-link
          v-for="(route, inner_index) in pipeline.routes"
          :key="inner_index"
          :to="{ path: '/' + pipeline.name + '/' + route }"
        >
          <b-button variant="outline-primary">{{ capitalizeFirstLetter(route) }}</b-button>
        </router-link>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import PipelinesConfig from '@/config/PipelinesConfig'
import Helper from '@/mixins/Helper'

export default {
  name: 'Dashboard',
  mixins: [Helper],
  computed: {
    pipelines() {
      return PipelinesConfig
    },
  },
}
</script>

<style scoped lang="scss"></style>
