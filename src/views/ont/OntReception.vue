<template>
  <div class="reception">
    <alert ref='alert'></alert>
    <b-modal v-model="importing" :hide-footer=true :hide-header=true :no-close-on-backdrop=true>
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
              @click="createTractionPlates"
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

export default {
  name: 'Reception',
  mixins: [Helper],
  props: {
  },
  data () {
    return {
      barcodes: [],
      plates: {},
      importing: false
    }
  },
  components: {
    Alert,
    Spinner
  },
  computed: {
    isDisabled () {
      return this.barcodes.length === 0 || this.importing
    }
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
      this.importing = true
      await this.handleSequencesapePlates()
      if (this.plates === {}) return
      
      this.plates.reduce((promiseChain, plate) => {
        return promiseChain.then((chainResults) => 
          this.createTractionPlate(plate).then(result => [...chainResults, result])
        )
        .catch((error) => {
          console.log(error)
          this.importing = false
        })
      }, Promise.resolve([])).then(results => {
        this.showAlert(results.join(','), 'success')
        this.importing = false
      })
    },
    async createTractionPlate ({barcode, wells}) {
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
