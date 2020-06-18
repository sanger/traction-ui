<template>
    <b-modal size="lg" ref="well-modal" >
      <template v-slot:modal-title v-bind:position="this.position">
        Add Library to Well: {{ position }}
      </template>

      <alert ref='alert'></alert>

      <b-form>
        <b-form-group id="movieTime-group"
                      label="Movie time:"
                      label-for="movieTime">
          <b-form-select ref="movieTime" 
                        id="movieTime" 
                        :value="movieTime" 
                        :options="movieTimeOptions" 
                        @change="updateMovieTime">
          </b-form-select>
        </b-form-group>

        <b-form-group id="plateLoading-group"
                      label="On Plate Loading Concentration (mP):"
                      label-for="onPlateLoadingConc">
          <b-form-input
            ref="onPlateLoadingConc"
            id="onPlateLoadingConc"
            :value="onPlateLoadingConc"
            @change="updateOnPlateLoadingConc"
            placeholder="On Plate Loading Concentration (mP)">
          </b-form-input>
        </b-form-group>

        <b-form-group id="insertSize-group"
                      label="Insert size:"
                      label-for="insertSize">
          <b-form-input
            ref="insertSize"
            id="insertSize"
            :value="insertSize"
            @change="updateInsertSize"
            placeholder="Insert Size">
          </b-form-input>
        </b-form-group>

        <b-form-group id="sequencingMode-group"
                      label="Sequencing mode:"
                      label-for="sequencingMode">
          <b-form-select ref="sequencingMode" 
                        id="sequencingMode" 
                        :value="sequencingMode" 
                        :options="sequencingModeOptions" 
                        @change="updateSequencingMode">
          </b-form-select>
        </b-form-group>

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
        <b-button variant="success" @click="update()" id="update-button">
          Update
        </b-button>
      </template>
    </b-modal>
</template>

<script>

import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'

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
      movieTimeOptions: [ { text: 'Movie Time', value: "" }, '15.0', '20.0', '24.0', '30.0' ],
      sequencingModeOptions: [ { text: 'Sequencing Mode', value: "" }, 'CLR', 'CCS'],
      wellLibrariesFields: ['barcode'],
    }
  },
  methods: {
    addRow() {
      this.addEmptyLibraryToWell(this.position)
    },
    removeRow(row) {
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
      if (this.currentRun.template_prep_kit_box_barcode !== "") {
        this.alert('Well updated', 'success')
        this.hide()
      } else {
        if (this.setPrepKitBarcode()) {
          this.alert('Well updated', 'success')
          this.hide()
        }
        else {
          this.alert('One or more Template Prep Kit Box Barcodes do not match', 'warning')
          this.hide()
        }
      }
    },
    setPrepKitBarcode() {
      let barcode = this.libraryByBarcode(this.wellLibraries[0].barcode).library_kit_barcode
      let libraries= this.wellLibraries.map(lib => {return this.libraryByBarcode(lib.barcode)})
      if (libraries.every(lib => lib.library_kit_barcode === libraries[0].library_kit_barcode)) {
        this.setTemplatePrepKitBoxBarcode(barcode)
        return true
      }
      this.setTemplatePrepKitBoxBarcode(barcode)
      return false
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
        let libraryId = this.libraryByBarcode(barcode).id
        let payload = { position: this.position, index: index, with: { id: libraryId, barcode: barcode }}
        this.addLibraryToWell(payload)
        this.showAlert('Library is valid', 'success')
      } else {
        this.showAlert('Library is not valid', 'danger')
      }
    },
     ...mapActions('traction/pacbio/tubes', [
      'isLibraryBarcodeValid',
      'getTubeForBarcode',
    ]),
    ...mapMutations('traction/pacbio/runs', [
      'createWell',
      'mutateWell',
      'addEmptyLibraryToWell',
      'removeLibraryFromWell',
      'addLibraryToWell',
      'setTemplatePrepKitBoxBarcode',
    ]),
    alert (message, type) {
      this.$emit('alert', message, type)
    },
  },
  computed: {
    ...mapGetters('traction/pacbio/runs', [
      'currentRun',
      'well',
    ]),
    ...mapGetters('traction/pacbio/libraries', [
      'libraryByBarcode',
    ]),
    ...mapState('traction/pacbio/runs', {
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
