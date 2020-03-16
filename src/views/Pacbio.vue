<template>
  <pipeline-view></pipeline-view>
</template>

<script>

import PipelineView from '@/views/PipelineView'

export default {
  name: 'Pacbio',
  components: {
    PipelineView
  },
  created () {
    localStorage.setItem('pipeline', 'pacbio')
  }
}

</script>