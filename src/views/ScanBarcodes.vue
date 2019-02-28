<template>
  <div class="scan-barcodes">
    <label for="barcodes">barcodes:</label>
    <textarea type="text" v-model="barcodes" rows="10" cols="30" name="barcodes" id="barcodes" />
    <b-button id="findTubes" variant="success" class="float-right" @click="findTubes" >Go!</b-button>
  </div>
</template>

<script>

import Alert from '@/components/Alert'
import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'

export default {
  name: 'ScanBarcodes',
  mixins: [ComponentFactory],
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
  computed: {
    queryString () {
      return this.barcodes.split('\n').filter(Boolean).join(',')
    }
  },
  methods: {
    findTubes () {
      
    }
  }
}

</script>