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
              id="findSequencescapePlates"
              variant="success"
              @click="handleSequencescapePlates"
              :disabled="this.barcodes.length === 0">
      Import
    </b-button>
  </div>
</template>

<script>
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import { getPlates, transformPlates} from '@/api/SequencescapePlates'

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
