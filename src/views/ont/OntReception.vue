<template>
  <div class="reception">
    <alert ref='alert'></alert>

    <b-modal v-model="busy" hide-footer hide-header no-close-on-backdrop>
      <spinner size="huge" message="Importing plates..."></spinner>
    </b-modal>

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
              @click="handleCreateTractionPlates"
              :disabled="isDisabled">
      Import
    </b-button>
  </div>
</template>

<script>
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import { getPlates, transformPlates} from '@/api/SequencescapePlates'
import CREATE_PLATE_WITH_SAMPLES from '@/graphql/queries/CreatePlateWithSamples.mutation.gql'
import Spinner from 'vue-simple-spinner'
import Api from '@/mixins/Api'

export default {
  name: 'Reception',
  mixins: [Helper, Api],
  data () {
    return {
      barcodes: [],
      busy: false
    }
  },
  components: {
    Alert,
    Spinner
  },
  methods: {
    async getSequencescapePlates() {
      await getPlates(this.sequencescapeRequest, this.formattedBarcodes)
    },
    async handleCreateTractionPlates () {
      this.busy = true
      let ssPlatesJson = await this.getSequencescapePlates()

      if (ssPlatesJson.length === 0) {
        this.showAlert(`There is no plate is sequencescape with barcode(s) ${this.formattedBarcodes}`, 'danger')
        this.busy = false
        return
      }
      
      await this.createTractionPlates(transformPlates(ssPlatesJson))
        .then(result => {
          this.busy = false
          this.showAlert(result, 'primary')
        })
    },
    // https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
    // TODO: simplify with await
    async createTractionPlates(plates) {
      return plates.reduce((promiseChain, plate) => {
        return promiseChain.then((chainResults) => 
          this.createTractionPlate(plate).then(result => [...chainResults, result])
        )
        .catch(console.error)
      }, Promise.resolve([]))
    },
    createTractionPlate ({barcode, wells}) {
      return this.$apollo.mutate({
        mutation: CREATE_PLATE_WITH_SAMPLES,
        variables: {
          barcode,
          wells
        }
      }).then(data => {
        let response = data.data.createPlateWithSamples
        if (response.errors.length > 0) {
          return `Plate ${barcode} - ${response.errors.join(', ')}`
        } else {
          return `Plate ${barcode} successfully created`
        }
      })
    }
  },
  computed: {
    formattedBarcodes () {
      return this.barcodes.split('\n').filter(Boolean).join(',')
    },
    isDisabled () {
      return this.barcodes.length === 0 || this.busy
    },
    sequencescapeRequest () {
      return this.api.sequencescape.plates
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
