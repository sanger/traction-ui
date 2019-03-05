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

import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'

export default {
  name: 'ScanBarcodes',
  mixins: [ComponentFactory],
  props: {
  },
  data () {
    return {
      barcodes: [],
      message: ''
    }
  },
  components: {
  },
  computed: {
    queryString () {
      return this.barcodes.split('\n').filter(Boolean).join(',')
    },
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    tubeRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('tubes'))
    }
  },
  methods: {
    async findTubes () {
      let rawResponse = await this.tubeRequest.get({filter: { barcode: this.queryString} }) 
      let response = new Api.Response(rawResponse)
      if (response.successful) {
        this.message = 'tubes successfully found'
        console.log(this.message)
        return response.deserialize.tubes
      } else {
        this.message = 'there was an error'
        console.log(this.message)
        return response
      }
    }
  }
}


</script>

<style lang="scss">
  textarea {
    border: 1px solid;
  }
</style>