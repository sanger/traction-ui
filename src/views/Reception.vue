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
      let self = this
      axios.get(`${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}`+
        `/api/v2/requests?filter[state]=pending&filter[request_type]=long_read`
      )
      .then(function (response) {
        let requests = self.buildRequestsFromResponseHelper(response.data.data)
        self.$store.commit('addRequests', requests)
      })
    },
    buildRequestsFromResponseHelper(data) {
      let requests = []
      for (let i = 0; i < data.length; i++) {
        let request = {
          id: data[i].id,
          name: data[i].attributes.name,
          species: data[i].attributes.species
        }
        requests.push(request)
      }
      return requests
    },
    // Export the selected requests to Traction backend service
    async postSelectedRequests () {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_TRACTION_API}/v1/samples`,
          { data: { attributes: { samples: this.getSelectedRequests() }}},
          this.config
        )
        this.$refs.alert.show(response.data, 'success')
      } catch (error) {
        let errors = error.response.data.errors
        this.$refs.alert.show(errors, 'danger')
      }
    },
    // Update the status of requests in SS from pending to started
    async updateRequestStatusInSS () {
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}/api/v2/requests`,
          { data: { attributes: { requests: this.updateStatusJson() }}},
          this.config
        )
        this.$refs.alert.show(response.data, 'success')
      } catch (error) {
        let errors = error.response.data.errors
        this.$refs.alert.show(errors, 'danger')
      }
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
