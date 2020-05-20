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
import CREATE_PLATE_WITH_COVID_SAMPLES from '@/graphql/queries/CreatePlateWithCovidSamples.mutation.gql'

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
      if (jsonPlates !== undefined) {
        this.plates = transformPlates(jsonPlates)
      }
    },
    // https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
    // TODO: simplify with await
    async createTractionPlates() {
      await this.handleSequencesapePlates()
      if (this.plates === {}) return
      
      this.plates.reduce((promiseChain, plate) => {
        return promiseChain.then((chainResults) => 
          this.createTractionPlate(plate).then(result => [...chainResults, result])
        )
        .catch(console.error)
      }, Promise.resolve([])).then(results => {
        this.showAlert(results.join(','), 'success')
      })
    },
    async createTractionPlate ({barcode, wells}) {
      return this.$apollo.mutate({
        mutation: CREATE_PLATE_WITH_COVID_SAMPLES,
        variables: {
          barcode,
          wells
        }
      }).then(data => {
        let response = data.data.createPlateWithCovidSamples
        if (response.errors.length > 0) {
          return `Plate ${barcode} - ${response.errors.join(', ')}`
        } else {
          return `Plate ${barcode} successfully created`
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
