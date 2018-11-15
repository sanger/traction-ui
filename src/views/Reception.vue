<template>
  <div class="reception">
    <sample-table v-bind:samples="samples" ></sample-table>
  </div>
</template>

<script>

import Request from '@/services/Sequencescape'
import SampleTable from '@/components/SampleTable'

export default {
  name: 'Reception',

  data () {
    return {
      samples: []
    }
  },
  created () {
    Request.all().then(response => {
      this.samples = response.data
    })
  },
  components: {
    SampleTable
  }
}
</script>
