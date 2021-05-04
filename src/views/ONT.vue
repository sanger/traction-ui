<template>
  <pipeline-view></pipeline-view>
</template>

<script>
import PipelineView from '@/views/PipelineView'

export default {
  name: 'ONT',
  components: {
    PipelineView,
  },
  created() {
    localStorage.setItem('pipeline', 'ont')
  },
}
</script>
