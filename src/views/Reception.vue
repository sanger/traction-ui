<template>
  <div class="reception">
    <alert ref='alert'></alert>

    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <textarea type="text" v-model="barcodes" class="form-control" rows="10" cols="10" name="barcodes" id="barcodes" />
    </div>

    <b-button class="scanButton" id="findSequencescapeTubes" variant="success" @click="handleSequencescapeTubes" :disabled="this.barcodes.length === 0">Find Sequencescape Tubes</b-button>
    <b-button class="scanButton" id="findTractionTubes" variant="success" @click="handleTractionTubes" :disabled="this.barcodes.length === 0">Find Traction Tubes</b-button>

  </div>
</template>

<script>
import Alert from '@/components/Alert'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Reception',
  props: {
  },
  data () {
    return {
      barcodes: [],
      message: ''
    }
  },
  components: {
    Alert
  },
  methods: {
    async handleTractionTubes () {
      let barcodes = this.getBarcodes()

      let response = await this.getTractionTubesForBarcodes(barcodes)
      if (response.successful && !response.empty) {
          this.handleTubeRedirect()
      } else {
        this.message = response.errors.message
        this.showAlert()
      }
    },
    async handleSequencescapeTubes () {
      let barcodes = this.getBarcodes()

      try {
        let getSSTubeResponse = await this.getSequencescapeTubesForBarcodes(barcodes)
        if (!getSSTubeResponse.successful || getSSTubeResponse.empty) {
          throw getSSTubeResponse.errors
        }

        let exportSampleTubesResponse = await this.exportSampleTubesIntoTraction(this.sequencescapeTubes)
        if (!exportSampleTubesResponse.successful || exportSampleTubesResponse.empty) {
          throw exportSampleTubesResponse.errors
        }

        this.handleTubeRedirect()
      } catch (err) {
        this.message = err
        this.showAlert()
      }
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    },
    getBarcodes () {
      return this.barcodes.split('\n').filter(Boolean).join(',')
    },
    handleTubeRedirect() {
      if (!this.tractionTubes.empty) {
        let table = this.tractionTubes.every(t => t.material.type == "requests") ? "Samples" : "Libraries"
        if (table) {
          this.$router.push({name: table})
        }
      } else {
        this.message = 'Failed to get Traction tubes'
        this.showAlert()
      }
    },
    ...mapActions('traction/saphyr/tubes', [
      'getTractionTubesForBarcodes',
      'exportSampleTubesIntoTraction'
    ]),
    ...mapActions('sequencescape', [
      'getSequencescapeTubesForBarcodes'
    ])
  },
  computed: {
    ...mapState('traction/saphyr/tubes', {
      tractionTubes: state => state.tractionTubes
    }),
    ...mapState('sequencescape', {
      sequencescapeTubes: state => state.sequencescapeTubes
    })
  }
}

</script>

<style lang="scss">
  textarea {
    border: 1px solid;
  }

  .scanButton {
    margin: 0.5rem;
  }
</style>
