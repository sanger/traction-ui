<template>
  <div class="reception">
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>Sample ID</th>
          <th>Name</th>
          <th>Species</th>
        </tr>
      </thead>
      <tbody>
        <data-list ref="requests" resource="requests">
          <div slot-scope="{ data: requests, errors, loading, load }">
            <request-item v-for="request in requests" v-bind:key="request.id" v-bind="request"></request-item>
          </div>
        </data-list>
      </tbody>
    </table>
    <b-button id="exportRequests" @click="exportRequests">Import samples</b-button>
  </div>
</template>

<script>

import Vue from 'vue'
import DataList from '@/api/DataList'
import DataModel from '@/api/DataModel'
import RequestItem from '@/components/RequestItem'

export default {
  name: 'Reception',
  data () {
    return {
      message: ''
    }
  },
  created () {
  },
  methods: {
    exportRequests () {
      // look into transaction?
      this.exportRequestsIntoTraction()
      this.updateSequencescapeRequests()
    },
    exportRequestsIntoTraction () {
      this.tractionApi.update(this.selected)
      if (this.tractionApi.data !== null) {
        this.message = 'Samples imported'
      }
      else {
        this.message = this.tractionApi.errors.message
      }
    },
    updateSequencescapeRequests () {
      this.sequencescapeApi.update(this.selectedForSS)
      if (this.sequencescapeApi.data !== null) {
        this.message = 'Samples imported'
      }
      else {
        this.message = this.sequencescapeApi.errors.message
      }
    }
  },
  components: {
    DataList,
    RequestItem
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
      return new Cmp({ propsData: { baseUrl: process.env.VUE_APP_TRACTION_API, apiNamespace: 'v1', resource: 'samples' }})
    },
    sequencescapeApi () {
      let Cmp = Vue.extend(DataModel)
      return new Cmp({ propsData: { baseUrl: process.env.VUE_APP_SEQUENCESCAPE_BASE_URL, apiNamespace: 'api/v2', resource: 'requests' }})
    }
  }
}
</script>

<style lang="scss">
</style>
