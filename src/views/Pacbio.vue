<template>
  <div class="pacbio">
    <pipeline-router pipeline="pacbio" />
    <h4>Pacbio</h4>
    <router-view></router-view>
  </div>
</template>

<script>

import PipelineRouter from '@/components/PipelineRouter'

export default {
  name: 'Pacbio',
  mixins: [],
  props: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    PipelineRouter
  },
  computed: {
  },
  created () {
  }
}
</script>
