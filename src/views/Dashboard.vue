<template>
  <div>
    <div class="grid grid-cols-3 p-4 gap-x-8">
      <LabelledCard
        v-for="(pipeline, index) in pipelines"
        :key="index"
        :title="pipeline.title"
        :description="pipeline.description"
      >
        <Link
          v-for="(route, inner_index) in pipeline.routes"
          :key="inner_index"
          :name="humanise(route)"
          :link="`/${pipeline.name}/${route}`"
        />
      </LabelledCard>
    </div>
  </div>
</template>

<script>
import PipelinesConfig from '@/config/PipelinesConfig'
import { humanise } from '@/lib/stringHumanisation'
import LabelledCard from '@/components/LabelledCard'
import Link from '@/components/Link'

export default {
  name: 'Dashboard',
  components: {
    LabelledCard,
    Link,
  },
  computed: {
    pipelines: () => PipelinesConfig,
  },
  methods: {
    humanise,
  },
}
</script>

<style scoped lang="scss"></style>
