<template>
  <div class="scan-barcodes">
    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <textarea type="text" v-model="barcodes" class="form-control" rows="10" cols="10" name="barcodes" id="barcodes" />
      <!-- b-button id="findSequencescapeTubes" variant="success" @click="findSequencescapeTubes" >find Sequencescape Tubes</b-button -->
      <b-button id="findTractionTubes" variant="success" @click="findTractionTubes">Find Traction Tubes</b-button>

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
      if (this.barcodes === undefined || !this.barcodes.length) return ''
      return this.barcodes.split('\n').filter(Boolean).join(',')
    },
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    sequencescapeConfig () {
      return this.build(Api.ConfigItem, Api.Config.sequencescape)
    },
    sequencescapeTubeRequest () {
      return this.build(Api.Request, this.sequencescapeConfig.resource('tubes'))
    },
    tractionTubeRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('tubes'))
    },
    tubeRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('tubes'))
    }
  },
  methods: {
    async findTubes (request) {
      if(!this.queryString) return
      let rawResponse = await request.get({filter: { barcode: this.queryString} })
      let response = new Api.Response(rawResponse)
      if (response.successful) {
        if (response.empty) {
          this.message = 'no tubes found'
          return response
        } else {
          this.message = 'tubes successfully found'
          let tubes = response.deserialize.tubes
          // handle tubes of different type
          this.$router.push({name: 'Table', params: {items: tubes}})
        }
      } else {
        this.message = 'there was an error'
        return response
      }
    },
    async findSequencescapeTubes () {
      return this.findTubes(this.sequencescapeTubeRequest)
    },
    async findTractionTubes () {
      return this.findTubes(this.tractionTubeRequest)
    }
  }
}

</script>

<style lang="scss">
  textarea {
    border: 1px solid;
  }
</style>
