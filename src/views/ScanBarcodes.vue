<template>
  <div class="scan-barcodes">
    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <textarea type="text" v-model="barcodes" class="form-control" rows="10" cols="10" name="barcodes" id="barcodes" />
      <b-button id="findSequencescapeTubes" variant="success" @click="handleSequencescapeTubes">Find Sequencescape Tubes</b-button>
      <b-button id="findTractionTubes" variant="success" @click="handleTractionTubes">Find Traction Tubes</b-button>
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
  methods: {
    async handleSequencescapeTubes () {
      let tubes = await this.findTubes(this.sequencescapeTubeRequest)
      await this.exportSampleTubesIntoTraction(tubes)
      await this.handleTractionTubes()
    },
    async handleTractionTubes () {
      let tubes = await this.findTubes(this.tractionTubeRequest)
      this.$router.push({name: 'Table', params: {items: tubes}})
    },
    async findTubes (request) {
      if(!this.queryString) return
      let rawResponse = await request.get({filter: { barcode: this.queryString} })
      let response = new Api.Response(rawResponse)

      if (response.successful) {
        if (response.empty) {
          this.message = 'No tubes found'
          return response
        } else {
          this.message = 'Tubes successfully found'
          return response.deserialize.tubes
        }
      } else {
        this.message = 'There was an error'
        return response
      }
    },
    async exportSampleTubesIntoTraction (tubes) {
      let sampleTubeJSON = tubes.map(t => Object.assign(
        {
          sequencescape_request_id: t.samples[0].sanger_sample_id, // TODO: check
          name: t.name,
          species: t.samples[0].sample_metadata.sample_common_name
        }
      ))

      let body = { data: { attributes: { samples: sampleTubeJSON }}}
      let rawResponse = await this.sampleRequest.create(body)
      let response = new Api.Response(rawResponse)

      if (response.successful) {
        this.barcodes = response.deserialize.samples.map(s=> s.barcode).join('\n')
        return response
      } else {
        this.message = response.errors.message
        return response
      }
    }
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
    sampleRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('samples'))
    }
  }
}

</script>

<style lang="scss">
  textarea {
    border: 1px solid;
  }
</style>
