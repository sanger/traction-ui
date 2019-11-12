<template>
    <b-modal ref="well-modal" title="Add Library to Well">
      
      <alert ref='alert'></alert>

      Position: {{ this.position }}

      <b-form>
        <b-form-input
          ref="libraryBarcode"
          id="libraryBarcode"
          :value="libraryBarcode"
          @change="updateLibraryBarcode"
          placeholder="Library Barcode">
        </b-form-input>

        <b-form-select ref="movieTime" id="movieTime" :value="movieTime" :options="movieTimeOptions" @change="updateMovieTime"></b-form-select>

        <b-form-input
          ref="onPlateLoadingConc"
          id="onPlateLoadingConc"
          :value="onPlateLoadingConc"
          @change="updateOnPlateLoadingConc"
          placeholder="On Plate Loading Concentration (mP)">
        </b-form-input>

        <b-form-input
          ref="insertSize"
          id="insertSize"
          :value="insertSize"
          @change="updateInsertSize"
          placeholder="Insert Size">
        </b-form-input>

        <b-form-select ref="sequencingMode" id="sequencingMode" :value="sequencingMode" :options="sequencingModeOptions" @change="updateSequencingMode"></b-form-select>

      </b-form>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancel
        </b-button>

        <b-button variant="success" @click="update()">
          Update Well
        </b-button>
      </template>
    </b-modal>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters} = createNamespacedHelpers('traction/pacbio/runs')

import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'

export default {
  name: 'WellModal',
  mixins: [Helper],
  props: {
    position: {
      type: [String],
      required: true,
    },
  },
  data () {
    return {
      movieTimeOptions: [ { text: 'Movie Time', value: "" }, '15.0', '20.0', '30.0' ],
      sequencingModeOptions: [ { text: 'Sequencing Mode', value: "" }, 'CLR', 'CCS'],
    }
  },
  methods: {
    showModalForPosition() {    
      this.$refs['well-modal'].show()
    },
    hide() {
      this.$refs['well-modal'].hide()
    },
    update() {
      this.hide()
      this.alert('Well updated', 'success')
    },
    updateInsertSize(insertSize) {
      this.setInsertSize({ position: this.position, insertSize: insertSize})
    },
    updateOnPlateLoadingConc(conc) {
      this.setOnPlateLoadingConc({ position: this.position, onPlateLoadingConc: conc})
    },
    updateMovieTime(movieTime) {
      this.setMovieTime({ position: this.position, movieTime: movieTime})
    },
    updateSequencingMode(seqMode) {
      this.setSequencingMode({ position: this.position, sequencingMode: seqMode})
    },
    async updateLibraryBarcode(barcode) {
      let isValid = await this.isLibraryBarcodeValid(barcode)

      if (isValid) {
        let libraryTube = await this.getTubeForBarcode(barcode)
        let library = libraryTube.material
        let payload = { position: this.position, library: { id: library.id, barcode: library.barcode }}
        this.setLibraryBarcode(payload)
      } else {
        this.showAlert('Library is not valid', 'danger')
      }
    },
     ...mapActions([
      'isLibraryBarcodeValid',
      'getTubeForBarcode',
    ]),
    ...mapMutations([
      'setLibraryBarcode',
      'setInsertSize',
      'setOnPlateLoadingConc',
      'setMovieTime',
      'setSequencingMode'
    ]),
    alert (message, type) {
      this.$emit('alert', message, type)
    },
  },
  computed: {
    ...mapGetters([
      'currentRun',
      'well'
    ]),
    ...mapState({
      insertSize () {
        return (this.well(this.position) ? this.well(this.position).insert_size : '')
      },
      onPlateLoadingConc () {
        return (this.well(this.position) ? this.well(this.position).on_plate_loading_concentration : '')
      },
      movieTime () {
        return (this.well(this.position) ? this.well(this.position).movie_time : '')
      },
      libraryBarcode () {
        // Assuming there is only one library in a well
        return (this.well(this.position) ? this.well(this.position).libraries[0].barcode : '')
      },
      sequencingMode () {
        return (this.well(this.position) ? this.well(this.position).sequencing_mode : '')
      }
    })
  },
  components: {
    Alert
  },
}
</script>
