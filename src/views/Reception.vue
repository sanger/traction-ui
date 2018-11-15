<template>
  <div class="reception">
    <sample-table v-bind:samples="samples" ></sample-table>
  </div>
</template>

<script>

import samples from '@/../tests/data/samples'
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
