<template>
  <b-modal ref="well-modal" size="lg">
    <template v-slot:modal-title :position="position">
      Add Library to Well: {{ position }}
    </template>

    <alert ref="alert"></alert>

    <b-form>
      <b-form-group id="movieTime-group" label="Movie time:" label-for="movieTime">
        <b-form-select
          id="movieTime"
          ref="movieTime"
          :value="movieTime"
          :options="movieTimeOptions"
          @change="updateMovieTime"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group
        id="plateLoading-group"
        label="On Plate Loading Concentration (mP):"
        label-for="onPlateLoadingConc"
      >
        <b-form-input
          id="onPlateLoadingConc"
          ref="onPlateLoadingConc"
          :value="onPlateLoadingConc"
          placeholder="On Plate Loading Concentration (mP)"
          @change="updateOnPlateLoadingConc"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group id="insertSize-group" label="Insert size:" label-for="insertSize">
        <b-form-input
          id="insertSize"
          ref="insertSize"
          :value="insertSize"
          placeholder="Insert Size"
          @change="updateInsertSize"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group id="generateHiFi-group" label="Generate HiFi Reads:" label-for="generateHiFi">
        <b-form-select
          id="generateHiFi"
          ref="generateHiFi"
          :value="generateHiFi"
          :options="generateHifiOptions[currentRun.system_name]"
          @change="updateGenerateHiFi"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group
        v-if="showCCSAnalysisOutput"
        id="ccsAnalysisOutput-group"
        label="CCS Analysis Output - Include Kinetics Information:"
        label-for="ccsAnalysisOutput"
      >
        <b-form-select
          id="ccsAnalysisOutput"
          ref="ccsAnalysisOutput"
          :value="ccsAnalysisOutput"
          :options="ccsAnalysisOutputOptions"
          @change="updateCCSAnalysisOutput"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group
        id="preExtensionTime-group"
        label="Pre-extension time (hours):"
        label-for="preExtensionTime"
      >
        <b-form-input
          id="preExtensionTime"
          ref="preExtensionTime"
          :value="preExtensionTime"
          placeholder="Pre-extension time"
          @change="updatePreExtensionTime"
        >
        </b-form-input>
      </b-form-group>
    </b-form>

    <b-table id="wellLibraries" stacked :items="wellLibraries" :fields="wellLibrariesFields">
      <template v-slot:table-caption>Libraries</template>

      <template v-slot:cell(barcode)="row">
        <b-form inline>
          <b-form-input
            id="libraryBarcode"
            ref="libraryBarcode"
            :value="`${row.item.barcode}`"
            placeholder="Library Barcode"
            @change="updateLibraryBarcode(row, $event)"
          >
          </b-form-input>

          <b-button class="button btn-xs btn-danger" inline @click="removeRow(row)">-</b-button>
        </b-form>
      </template>
    </b-table>

    <b-button class="button btn-xs btn-success" @click="addRow">+</b-button>

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="success" @click="update()"> Update </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'

import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'

export default {
  name: 'WellModal',
  components: {
    Alert,
  },
  mixins: [Helper],
  props: {
    position: {
      type: [String],
      required: true,
    },
  },
  data() {
    return {
      movieTimeOptions: [{ text: 'Movie Time', value: '' }, '15.0', '20.0', '24.0', '30.0'],
      wellLibrariesFields: ['barcode'],
      generateHifiOptions: {
        '': [{ text: 'Please select a System Name', value: '', disabled: true }],
        'Sequel I': ['In SMRT Link', 'Do Not Generate'],
        'Sequel II': ['In SMRT Link', 'Do Not Generate'],
        'Sequel IIe': ['In SMRT Link', 'Do Not Generate', 'On Instrument'],
      },
      ccsAnalysisOutputOptions: ['Yes', 'No'],
    }
  },
  computed: {
    showCCSAnalysisOutput() {
      return ['In SMRT Link', 'On Instrument'].includes(this.generateHiFi)
    },
    ...mapGetters('traction/pacbio/runs', ['currentRun', 'well']),
    ...mapGetters('traction/pacbio/libraries', ['libraryByBarcode']),
    ...mapState('traction/pacbio/runs', {
      insertSize() {
        return this.well(this.position) ? this.well(this.position).insert_size : ''
      },
      onPlateLoadingConc() {
        return this.well(this.position)
          ? this.well(this.position).on_plate_loading_concentration
          : ''
      },
      movieTime() {
        return this.well(this.position) ? this.well(this.position).movie_time : ''
      },
      wellLibraries() {
        return this.well(this.position) ? this.well(this.position).libraries : []
      },
      preExtensionTime() {
        return this.well(this.position) ? this.well(this.position).pre_extension_time : ''
      },
      generateHiFi() {
        return this.well(this.position) ? this.well(this.position).generate_hifi : ''
      },
      ccsAnalysisOutput() {
        return this.well(this.position) ? this.well(this.position).ccs_analysis_output : ''
      },
    }),
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
      this.mutateWell({
        position: this.position,
        property: 'on_plate_loading_concentration',
        with: conc,
      })
    },
    updateMovieTime(movieTime) {
      this.mutateWell({ position: this.position, property: 'movie_time', with: movieTime })
    },
    updatePreExtensionTime(preExtensionTime) {
      this.mutateWell({
        position: this.position,
        property: 'pre_extension_time',
        with: preExtensionTime,
      })
    },
    updateGenerateHiFi(generateHiFi) {
      // update CCS Analysis Output too, as it is based off Generate Hifi Reads
      generateHiFi == 'Do Not Generate'
        ? this.updateCCSAnalysisOutput('No')
        : this.updateCCSAnalysisOutput('Yes')
      this.mutateWell({ position: this.position, property: 'generate_hifi', with: generateHiFi })
    },
    updateCCSAnalysisOutput(ccsAnalysisOutput) {
      this.mutateWell({
        position: this.position,
        property: 'ccs_analysis_output',
        with: ccsAnalysisOutput,
      })
    },
    async updateLibraryBarcode(row, barcode) {
      let index = row.index

      let isValid = await this.isLibraryBarcodeValid(barcode)

      if (isValid) {
        let libraryId = this.libraryByBarcode(barcode).id
        let payload = {
          position: this.position,
          index: index,
          with: { id: libraryId, barcode: barcode },
        }
        this.addLibraryToWell(payload)
        this.showAlert('Library is valid', 'success')
      } else {
        this.showAlert('Library is not valid', 'danger')
      }
    },
    ...mapActions('traction/pacbio/tubes', ['isLibraryBarcodeValid', 'getTubeForBarcode']),
    ...mapMutations('traction/pacbio/runs', [
      'createWell',
      'mutateWell',
      'addEmptyLibraryToWell',
      'removeLibraryFromWell',
      'addLibraryToWell',
    ]),
    alert(message, type) {
      this.$emit('alert', message, type)
    },
  },
}
</script>
