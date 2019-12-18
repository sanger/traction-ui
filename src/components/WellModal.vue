<template>
    <b-modal size="lg" ref="well-modal" >
      <template v-slot:modal-title v-bind:position="this.position">
        Add Library to Well: {{ position }}
      </template>

      <alert ref='alert'></alert>

      <b-form>
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

      <b-table stacked :items="wellLibraries" :fields="wellLibrariesFields" id="wellLibraries">
        <template v-slot:table-caption>Libraries</template>

        <template v-slot:cell(barcode)="row" >
          <b-form inline>
            <b-form-input
              ref="libraryBarcode"
              id="libraryBarcode"
              :value="`${row.item.barcode}`"
              @change="updateLibraryBarcode(row, $event)"
              placeholder="Library Barcode">
            </b-form-input>

            <b-button class="button btn-xs btn-danger" @click="removeRow(row)" inline>-</b-button>
          </b-form>
        </template>
      </b-table>

      <b-button class="button btn-xs btn-success" @click="addRow">+</b-button>

      <template v-slot:modal-footer="{ ok }">
        <b-button variant="success" @click="update()">
          Update
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
      wellLibrariesFields: ['barcode'],
    }
  },
  methods: {
    addRow(){
      this.addEmptyLibraryToWell(this.position)
    },
    removeRow(row){
      this.removeLibraryFromWell({ position: this.position, index: row.index })
    },
    showModalForPosition() { 
      if (!this.well(this.position)) {
        this.createWell(this.position)
      }
      this.$refs['well-modal'].show()
    },
    hide() {
      this.$refs['well-modal'].hide()
    },
    update() {
      this.alert('Well updated', 'success')
      this.hide()
    },
    updateInsertSize(insertSize) {
      this.mutateWell({ position: this.position, property: 'insert_size', with: insertSize })
    },
    updateOnPlateLoadingConc(conc) {
      this.mutateWell({ position: this.position, property: 'on_plate_loading_concentration', with: conc })
    },
    updateMovieTime(movieTime) {
      this.mutateWell({ position: this.position, property: 'movie_time', with: movieTime })
    },
    updateSequencingMode(seqMode) {
      this.mutateWell({ position: this.position, property: 'sequencing_mode', with: seqMode })
    },
    async updateLibraryBarcode(row, barcode) {
      let index = row.index

      let isValid = await this.isLibraryBarcodeValid(barcode)

      if (isValid) {
        let libraryTube = await this.getTubeForBarcode(barcode)
        let library = libraryTube.material
        let payload = { position: this.position, index: index, with: { id: library.id, barcode: library.barcode }}
        this.addLibraryToWell(payload)
      } else {
        this.showAlert('Library is not valid', 'danger')
      }
    },
     ...mapActions([
      'isLibraryBarcodeValid',
      'getTubeForBarcode',
    ]),
    ...mapMutations([
      'createWell',
      'mutateWell',
      'addEmptyLibraryToWell',
      'removeLibraryFromWell',
      'addLibraryToWell'
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
      sequencingMode () {
        return (this.well(this.position) ? this.well(this.position).sequencing_mode : '')
      },
      wellLibraries () {
        return (this.well(this.position) ? this.well(this.position).libraries : [])
      }
    })
  },
  components: {
    Alert
  },
}
</script>
