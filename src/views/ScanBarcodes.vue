<template>
  <div class="scan-barcodes">
    <div class="form-group">
      <label for="barcodes">barcodes:</label>
      <textarea type="text" v-model="barcodes" class="form-control" rows="10" cols="10" name="barcodes" id="barcodes" />
      <b-button id="findTubes" variant="success" @click="findTubes" >Go!</b-button>
    </div>
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
    },
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    tubeRequest () {
      return this.build(Api.Request, {...this.tractionConfig.resource('tubes'), filters: { barcode: this.queryString }})
    }
  },
  methods: {
    async findTubes () {
      let rawResponse = await this.tubeRequest.get() 
      let response = new Api.Response(rawResponse).deserialize.tubes
      console.log(response)
      // return new Api.Response(rawResponse).deserialize.tubes
      return response
    }
  }
}

</script>

<style lang="scss">
  textarea {
    border: 1px solid;
  }
</style>