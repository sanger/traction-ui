<template>
  <div class="reception">
    <!-- <sample-table v-bind:samples="samples" ></sample-table> -->
  </div>
</template>

<script>

import Request from '@/services/Sequencescape'
import SampleTable from '@/components/SampleTable'

export default {
  name: 'Reception',

  data () {
    return {
      samples: {}
    }
  },
  mounted () {
    // this.samples = Request.where({ type: 'long_read', state: 'pending'})
    // let self = this
    // Request.all().then(response => {
    //   this.samples = response.data
    // })
  },
  methods: {
    getSamples () {
      Request.all().then(response => {
        this.samples = response.data
      })
    }
  },
  components: {
    SampleTable
  }
}
</script>
