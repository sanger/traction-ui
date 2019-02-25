<template>
  <div class="reception">
    <alert ref='alert'></alert>

      <b-table
       show-empty
       :items="provider"
       :fields="fields"
       >
        <template slot="selected" slot-scope="row">
           <input type="checkbox" class="selected" v-model="selected" :value="row.item" />
        </template>
      </b-table>

    <b-button id="exportRequests" @click="exportRequests" class="float-right">Import Requests</b-button>
  </div>
</template>

<script>

import Alert from '@/components/Alert'
import ComponentFactory from '@/mixins/ComponentFactory'
import Api from '@/api'

export default {
  name: 'Reception',
  mixins: [ComponentFactory],
  props: {
  },
  data () {
    return {
      message: '',
      fields: [
        { key: 'selected', label: '' },
        { key: 'id', label: 'Sample ID' },
        { key: 'name', label: 'Name' },
        { key: 'species', label: 'Species' },
      ],
      selected: []
    }
  },
  methods: {
    async getRequests () {
      try {
        let requests = await this.receptionRequest.get()
        return new Api.Response(requests).deserialize.requests
      } catch(error) {
        return error
      }
    },
    async exportRequests () {
      try {
        await this.exportRequestsIntoTraction()
        await this.updateSequencescapeRequests()
      } catch (error) {
        // log error
      } finally {
        this.showAlert
      }
    },
    async exportRequestsIntoTraction () {
      let body = { data: { attributes: { samples: this.selectedJSON(this.selected) }}}
      let rawResponse = await this.sampleRequest.create(body)
      let response = new Api.Response(rawResponse)

      if (response.successful) {
        this.message = 'Samples imported into Traction'
      } else {
        this.message = response.errors.message
        throw this.message
      }
    },
    //TODO: This is a perfect place to implement a batch request
    async updateSequencescapeRequests () {

      let body = this.selected.map(item => {
        return { data: { type: 'requests', id: item.id, attributes: { state: 'started' }} }
      })

      let rawResponse = await this.receptionRequest.update(body)

      let responses = rawResponse.map(item => new Api.Response(item))

      if (responses.every(r => Object.keys(r.errors).length === 0)) {
        this.message = 'Samples updated in SS'
      } else {
        this.message = responses.map(r => r.errors.message)
        throw this.message
      }
    },
    selectedJSON(selected) {
      return selected.map(r =>
        Object.assign({
          sequencescape_request_id: r.id,
          name: r.samples[0].name,
          species: r.samples[0].sample_metadata.sample_common_name
        }
      ))
    },
    provider() {
      return this.getRequests()
    }
  },
  components: {
    Alert
  },
  computed: {
    sampleRequest () {
      return this.build(Api.Request, this.tractionConfig.resource('samples'))
    },
    tractionConfig () {
      return this.build(Api.ConfigItem, Api.Config.traction)
    },
    receptionRequest () {
      return this.build(Api.Request, this.sequencescapeConfig.resource('requests'))
    },
    sequencescapeConfig () {
      return this.build(Api.ConfigItem, Api.Config.sequencescape)
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  created () {
  }
}
</script>

<style lang="scss">

</style>
