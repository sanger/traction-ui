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

        <b-form-group
                      id="generateHiFi-group"
                      label="Generate HiFi Reads:"
                      label-for="generateHiFi">
          <b-form-select
            ref="generateHiFi"
            id="generateHiFi"
            :value="generateHiFi"
            :options="this.generateHifiOptions[this.currentRun.system_name]"
            @change="updateGenerateHiFi"
          >
          </b-form-select>
        </b-form-group>

        <b-form-group v-if="showCCSAnalysisOutput"
                      id="ccsAnalysisOutput-group"
                      label="CCS Analysis Output - Include Kinetics Information:"
                      label-for="ccsAnalysisOutput">
          <b-form-select
            ref="ccsAnalysisOutput"
            id="ccsAnalysisOutput"
            :value="ccsAnalysisOutput"
            :options="this.ccsAnalysisOutputOptions"
            @change="updateCCSAnalysisOutput"
          >
          </b-form-select>
        </b-form-group>

        <b-form-group
                      id="preExtensionTime-group"
                      label="Pre-extension time (hours):"
                      label-for="preExtensionTime">
          <b-form-input
            ref="preExtensionTime"
            id="preExtensionTime"
            :value="preExtensionTime"
            @change="updatePreExtensionTime"
            placeholder="Pre-extension time">
          </b-form-input>
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
        <b-button variant="success" @click="update()">
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
      wellLibrariesFields: ['barcode'],
      generateHifiOptions: {
        "": [{ text: 'Please select a System Name', value: "", disabled: true }],
        "Sequel I": ['In SMRT Link', 'Do Not Generate'],
        "Sequel II": ['In SMRT Link', 'Do Not Generate'],
        "Sequel IIe": ['In SMRT Link', 'Do Not Generate', 'On Instrument'],
      },
      ccsAnalysisOutputOptions: ['Yes', 'No']
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
    updatePreExtensionTime(preExtensionTime) {
      this.mutateWell({ position: this.position, property: 'pre_extension_time', with: preExtensionTime })
    },
    updateGenerateHiFi(generateHiFi) {
      // update CCS Analysis Output too, as it is based off Generate Hifi Reads
      generateHiFi == "Do Not Generate" ? this.updateCCSAnalysisOutput("No") : this.updateCCSAnalysisOutput("Yes")
      this.mutateWell({ position: this.position, property: 'generate_hifi', with: generateHiFi })
    },
    updateCCSAnalysisOutput(ccsAnalysisOutput) {
      this.mutateWell({ position: this.position, property: 'ccs_analysis_output', with: ccsAnalysisOutput })
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
      'addLibraryToWell'
    ]),
    alert (message, type) {
      this.$emit('alert', message, type)
    },
  },
  computed: {
    showCCSAnalysisOutput() {
      return ["In SMRT Link", "On Instrument"].includes(this.generateHiFi)
    },
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
      wellLibraries () {
        return (this.well(this.position) ? this.well(this.position).libraries : [])
      },
      preExtensionTime () {
        return (this.well(this.position) ? this.well(this.position).pre_extension_time : '')
      },
      generateHiFi () {
        return (this.well(this.position) ? this.well(this.position).generate_hifi : '')
      },
      ccsAnalysisOutput() {
        return (this.well(this.position) ? this.well(this.position).ccs_analysis_output : '')
      },
    })
  },
  components: {
    Alert
  },
}
</script>
