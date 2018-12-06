<template>
  <div class="reception">
    <alert ref='alert'></alert>
    <request-list ref:sample-list v-bind:samples="requests"></request-list>
    <b-button id="exportRequestsButton" @click="postSelectedRequests">Import samples</b-button>
  </div>
</template>

<script>
import RequestList from '@/components/RequestList'
import axios from 'axios'
import Alert from '@/components/Alert'
import Request from '@/api/Request'

export default {
  name: 'Reception',

  data () {
    return {
      requests: this.$store.getters.requests
    }
  },
  created() {
    this.getRequests()
  },
  methods: {
    getRequests() {
      Request.baseUrl = process.env.VUE_APP_SEQUENCESCAPE_BASE_URL
      Request.apiNamespace = '/api/v2/requests?filter[state]=pending&filter[request_type]=long_read'
      this.$store.dispatch('get')
    },
    // Export the selected requests to Traction backend service
    postSelectedRequests () {
      Request.baseUrl = process.env.VUE_APP_TRACTION_API
      Request.apiNamespace = '/v1/samples'
      let data = { data: { attributes: { samples: this.getSelectedRequests() }}}
      this.$store.dispatch('post', data)
    },
    // Update the status of requests in SS from pending to started
    updateRequestStatusInSS () {
      Request.baseUrl = process.env.VUE_APP_SEQUENCESCAPE_BASE_URL
      Request.apiNamespace = '/api/v2/requests'
      let data = { data: { attributes: { requests: this.updateStatusJson() }}}
      this.$store.dispatch('patch', data)

      //   handle alerts
      //   let errors = error.response.data.errors
      //   this.$refs.alert.show(error.response.data.errors, 'danger')

    },
    getSelectedRequests() {
      return this.$store.getters.selectedRequests()
    },
    updateStatusJson () {
      return this.getSelectedRequests().map(
        request => ({ id: request.id, state: 'started'}))
    }
  },
  components: {
    RequestList,
    Alert
  },
  computed: {
    config () {
       return { headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      } }
    }
  }
}
</script>

<style lang="scss">
#exportRequestsButton {
  float: right;
}
</style>
