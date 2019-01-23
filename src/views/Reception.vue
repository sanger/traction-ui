<template>
  <div class="reception">
    <alert ref='alert'></alert>
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Request ID</th>
            <th>Name</th>
            <th>Species</th>
          </tr>
        </thead>
        <data-list ref="requests" :baseURL="sequencescapeBaseURL" apiNamespace="api/v2" resource="requests" v-bind:filters="{type: 'long_read', state: 'pending'}">
          <tbody slot-scope="{ data: requests }">
            <request-item v-for="request in requests" v-bind:key="request.id" v-bind="request"></request-item>
          </tbody>
        </data-list>
      </table>
    <b-button id="exportRequests" @click="exportRequests" class="float-right">Import Requests</b-button>
  </div>
</template>

<script>

import Vue from 'vue'
import DataList from '@/api/DataList'
import DataModel from '@/api/DataModel'
import RequestItem from '@/components/RequestItem'
import Alert from '@/components/Alert'

export default {
  props: {
    sequencescapeBaseURL: {
      type: String,
      default: process.env.VUE_APP_SEQUENCESCAPE_BASE_URL
    },
    tractionBaseURL: {
      type: String,
      default: process.env.VUE_APP_TRACTION_BASE_URL
    }
  },
  name: 'Reception',
  data () {
    return {
      message: ''
    }
  },
  created () {
  },
  methods: {
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
      let body = { data: { attributes: { samples: this.selected }}}
      await this.tractionApi.create(body)

      if (this.tractionApi.data !== null) {
        this.message = 'Samples imported into Traction'
      } else {
        this.message = this.tractionApi.errors.message
        throw this.message
      }
    },
    async updateSequencescapeRequests () {
      for (let i = 0; i < this.selected.length; i++) {
        let id = this.selected[i].sequencescape_request_id
        let body = { data: { type: 'requests', id: id, attributes: { state: 'started' }}}
        await this.sequencescapeApi.update(id, body)
      }

      if (this.sequencescapeApi.data !== null) {
        this.message = 'Samples updated in SS'
      } else {
        this.message = this.sequencescapeApi.errors.message
        throw this.message
      }
    }
  },
  components: {
    DataList,
    RequestItem,
    Alert
  },
  computed: {
    // should this property be in DataList??
    selected () {
      return this.$refs.requests.$children.filter(request => request.selected).map(request => request.json)
    },
    selectedForSS () {
      return this.$refs.requests.$children.filter(request => request.selected).map(request => ({ id: request.id, state: 'started'}))
    },
    tractionApi () {
      let Cmp = Vue.extend(DataModel)
      return new Cmp({ propsData: { baseURL: this.tractionBaseURL, apiNamespace: 'v1', resource: 'samples' }})
    },
    sequencescapeApi () {
      let Cmp = Vue.extend(DataModel)
      return new Cmp({ propsData: { baseURL: this.sequencescapeBaseURL, apiNamespace: 'api/v2', resource: 'requests' }})
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  }
}
</script>

<style lang="scss">

</style>
