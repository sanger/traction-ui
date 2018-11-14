<template>
  <div class="reception">
    <sample-table></sample-table>
  </div>
</template>

<script>

import samples from '@/../tests/data/samples.json'
import SampleTable from '@/components/SampleTable'

export default {
  name: 'Reception',

  data () {
    return {
      samples: []
    }
  },
  created () {
    this.samples = samples
  },
  components: {
    SampleTable
  }
}
</script>
