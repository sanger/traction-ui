<template>
  <div class="reception">
    <alert ref='alert'></alert>

      <b-table
       show-empty
       :items="getSSRequests"
       :fields="fields"
       >
        <template slot="selected" slot-scope="row">
          <b-checkbox @change="toggleSelectedRow(row.item)"></b-checkbox>
        </template>
      </b-table>

    <b-button id="exportRequests" @click="exportRequests" class="float-right">Import Requests</b-button>
  </div>
</template>

<script>

import Alert from '@/components/Alert'
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'
import ComponentFactory from '@/mixins/ComponentFactory'
import Request from '@/mixins/Request'
import Response from '@/api/Response'

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
    toggleSelectedRow(item) {
      if (this.selected.indexOf(item) === -1) {
        this.selected.push(item)
      } else {
        this.selected.splice(this.selected.indexOf(item), 1 );
      }
    },
    async getSSRequests () {
      try {
        let rawSSRequests = await this.ssRequestRequest.get()
        return new Response(rawSSRequests).deserialize.requests
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
      let response = new Response(rawResponse)

      if (Object.keys(response.errors).length === 0) {
        this.message = 'Samples imported into Traction'
      } else {
        this.message = response.errors.message
        throw this.message
      }
    },
    async updateSequencescapeRequests () {
      var requestBody = []
      for (let i = 0; i < this.selected.length; i++) {
        let id = this.selected[i].id
        let request = { data: { type: 'requests', id: id, attributes: { state: 'started' }} }
        requestBody.push(request)
      }
      let rawResponse = await this.ssRequestRequest.update(requestBody)

      var responses = []
      for (let i = 0; i < this.selected.length; i++) {
        responses.push(new Response(rawResponse[i]))
      }

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
    }
  },
  components: {
    Alert
  },
  computed: {
    sampleRequest () {
      return this.build(Request, this.tractionConfig.resource('samples'))
    },
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    },
    ssRequestRequest () {
      return this.build(Request, this.sequencescapeConfig.resource('requests'))
    },
    sequencescapeConfig () {
      return this.build(ConfigItem, ApiConfig.sequencescape)
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
