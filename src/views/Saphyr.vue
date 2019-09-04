<template>
  <div class="saphyr">
    <pipeline-router pipeline="saphyr" />
    <h4>Saphyr</h4>
    <router-view></router-view>
  </div>
</template>

<script>

import PipelineRouter from '@/components/PipelineRouter'

export default {
  name: 'Saphyr',
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