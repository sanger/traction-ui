<template>
  <div class="reception">
    <alert ref='alert'></alert>
  </div>
</template>

<script>
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
// import * as consts from '@/consts/consts'

// import { mapActions, mapState } from 'vuex'

export default {
  name: 'Reception',
  mixins: [Helper],
  props: {
  },
  data () {
    return {
      barcodes: []
    }
  },
  components: {
    Alert
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  textarea {
    border: 1px solid;
  }

  .scanButton {
    margin: 0.5rem;
  }
</style>
