<template>
  <div class="reception">
    <alert ref='alert'></alert>

    <div class="form-group">
      <label for="barcodes">Barcodes:</label>
      <textarea type="text"
                v-model="barcodes"
                class="form-control"
                rows="10"
                cols="10"
                name="barcodes"
                id="barcodes"/>
    </div>
    <b-button class="scanButton"
              id="createTractionPlates"
              variant="success"
              @click="createTractionPlates"
              :disabled="this.barcodes.length === 0">
      Import
    </b-button>
  </div>
</template>

<script>
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import { getPlates, transformPlates} from '@/api/SequencescapePlates'
import gql from 'graphql-tag'

export default {
  name: 'Reception',
  mixins: [Helper],
  props: {
  },
  data () {
    return {
      barcodes: [],
      plates: {}
    }
  },
  components: {
    Alert
  },
  methods: {
    async getSequencescapePlates (barcodes) {
      return await getPlates(this.$store.getters.api.sequencescape.plates, barcodes)
    },
    getBarcodes () {
      return this.barcodes.split('\n').filter(Boolean).join(',')
    },
    async handleSequencesapePlates () {
      let jsonPlates = await this.getSequencescapePlates(this.getBarcodes())
      if (jsonPlates != undefined) {
        this.plates = transformPlates(jsonPlates)
      }
    },
    async createTractionPlates () {
      await this.handleSequencesapePlates()
      if (this.plates === {}) return
      this.$apollo.mutate({
        mutation: gql`mutation {
            createPlateWithCovidSamples(
                input: {
                    arguments: ${this.plates[0]}
                }
            ) {
                plate {
                    id
                    barcode
                    wells {
                        plateId
                    }
                }
                errors
            }
        }`
      }).then(data => {
        let response = data.data.createPlateWithCovidSamples
        if (response.errors.length > 0) {
          this.$emit('alert', 'Failure: ' + data.data.createPlateWithCovidSamples.errors.join(', '), 'danger')
        } else {
          this.$emit('alert', 'Plate successfully created', 'success')
        }
      })
    }
  }
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
