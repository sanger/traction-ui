<template>
  <pipeline-view></pipeline-view>
</template>

<script>
import PipelineView from '@/views/PipelineView'

export default {
  name: 'Saphyr',
  components: {
    PipelineView,
  },
  created() {
    localStorage.setItem('pipeline', 'saphyr')
  },
}
</script>
