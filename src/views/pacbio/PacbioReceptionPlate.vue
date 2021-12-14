<template>
  <div class="reception">
    <b-modal v-model="busy" hide-footer hide-header no-close-on-backdrop>
      <spinner size="huge" message="Importing plates..."></spinner>
    </b-modal>
    <p>
      <b-alert :show="isError" dismissible variant="danger">
        {{ alertMessage }}
      </b-alert>
      <b-alert :show="isSuccess" dismissible variant="success">
        {{ alertMessage }}
      </b-alert>
    </p>
    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <textarea
        id="barcodes"
        v-model="barcodes"
        type="text"
        class="form-control"
        rows="10"
        cols="10"
        name="barcodes"
      />
    </div>
    <b-button
      id="createTractionPlates"
      class="scanButton"
      variant="success"
      :disabled="isDisabled"
      @click="createTractionPlates"
    >
      Import
    </b-button>
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import Api from '@/mixins/Api'
import { createPlates } from '@/services/traction/Pacbio'

export default {
  name: 'Reception',
  components: {
    Spinner,
  },
  mixins: [Api],
  data() {
    return {
      barcodes: [],
      busy: false,
      alertMessage: '',
      status: '',
    }
  },
  computed: {
    formattedBarcodes() {
      return this.barcodes.split('\n').filter(Boolean).join(',')
    },
    isDisabled() {
      return this.barcodes.length === 0 || this.busy
    },
    isSuccess() {
      return this.status === 'success'
    },
    isError() {
      return this.status === 'error'
    },
    sequencescapeRequest() {
      return this.api.sequencescape.plates
    },
    tractionRequest() {
      return this.api.traction.pacbio.plates
    },
    requests() {
      return {
        traction: this.tractionRequest,
        sequencescape: this.sequencescapeRequest,
      }
    },
  },
  methods: {
    async createTractionPlates() {
      this.busy = true
      const response = await createPlates({
        requests: this.requests,
        barcodes: this.formattedBarcodes,
      })
      this.setStatus(response)
      this.busy = false
    },
    setStatus({ status, message }) {
      this.status = status
      this.alertMessage = message
    },
  },
}
</script>

<style scoped lang="scss">
textarea {
  border: 1px solid;
}

.scanButton {
  margin: 0.5rem;
}
</style>
