<template>
  <traction-modal ref="well-modal" :static="isStatic" size="lg">
    <template #modal-title> Add Pool to Well: {{ position }} </template>

    <traction-form>
      <traction-form-group id="movieTime-group" label="Movie time:" label-for="movieTime">
        <traction-select
          id="movieTime"
          ref="movieTime"
          v-model="currentWell.movie_time"
          data-attribute="movie-time"
          :options="movieTimeOptions"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        id="plateLoading-group"
        label="On Plate Loading Concentration (mP):"
        label-for="onPlateLoadingConc"
      >
        <traction-input
          id="onPlateLoadingConc"
          ref="onPlateLoadingConc"
          v-model="currentWell.on_plate_loading_concentration"
          data-attribute="on-plate-loading-concentration"
          placeholder="On Plate Loading Concentration (mP)"
        >
        </traction-input>
      </traction-form-group>

      <traction-form-group
        v-if="['v10'].includes(selectedSmrtLinkVersion.name)"
        id="generateHiFi-group"
        label="Generate HiFi Reads:"
        label-for="generateHiFi"
      >
        <traction-select
          id="generateHiFi"
          ref="generateHiFi"
          v-model="currentWell.generate_hifi"
          data-attribute="generate-hifi"
          :options="generateHifiOptions[currentRun.system_name]"
          @change="updateCCSAnalysisOutput"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        v-if="['v10'].includes(selectedSmrtLinkVersion.name)"
        id="ccsAnalysisOutput-group"
        label="CCS Analysis Output - Include Kinetics Information:"
        label-for="ccsAnalysisOutput"
      >
        <traction-select
          id="ccsAnalysisOutput"
          ref="ccsAnalysisOutput"
          v-model="currentWell.ccs_analysis_output"
          data-attribute="ccs-analysis-output"
          :options="ccsAnalysisOutputOptions"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        id="preExtensionTime-group"
        label="Pre-extension time (hours):"
        label-for="preExtensionTime"
      >
        <traction-input
          id="preExtensionTime"
          ref="preExtensionTime"
          v-model="currentWell.pre_extension_time"
          data-attribute="pre-extension-time"
          placeholder="Pre-extension time"
        >
        </traction-input>
      </traction-form-group>

      <traction-form-group
        id="bindingKitBoxBarcode-group"
        label="Binding Kit Box Barcode: "
        label-for="bindingKitBoxBarcode"
      >
        <traction-input
          id="bindingKitBoxBarcode"
          ref="bindingKitBoxBarcode"
          v-model="currentWell.binding_kit_box_barcode"
          data-attribute="binding-kit-box-barcode"
          placeholder="Binding Kit Box Barcode"
        >
        </traction-input>
      </traction-form-group>
      <traction-form-group
        id="loadingTarget-group"
        label="Loading Target (P1 + P2): (0 to 1) "
        label-for="loadingTarget"
      >
        <traction-input
          id="loadingTarget"
          ref="loadingTarget"
          v-model="currentWell.loading_target_p1_plus_p2"
          data-attribute="loading-target-p1-plus-p2"
          placeholder="Adaptive loading disabled - Add loading target to enable"
          type="number"
          min="0"
          max="1"
          step="0.05"
          lazy-formatter
          :formatter="formatLoadingTargetValue"
        >
        </traction-input>
      </traction-form-group>

      <traction-form-group
        v-if="['v11'].includes(selectedSmrtLinkVersion.name)"
        label="CCS Output Include Kinetics Information"
        label-for="ccs-analysis-output-include-kinetics-information"
      >
        <traction-select
          id="ccs-analysis-output-include-kinetics-information"
          v-model="currentWell.ccs_analysis_output_include_kinetics_information"
          :options="ccsAnalysisOutputOptions"
          data-attribute="ccs-analysis-output-include-kinetics-information"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        v-if="['v11'].includes(selectedSmrtLinkVersion.name)"
        label="CCS Analysis Output Include Low Quality Reads"
        label-for="ccs-analysis-output-include-low-quality-reads"
      >
        <traction-select
          id="ccs-analysis-output-include-low-quality-reads"
          v-model="currentWell.ccs_analysis_output_include_low_quality_reads"
          :options="ccsAnalysisOutputOptions"
          data-attribute="ccs-analysis-output-include-low-quality-reads"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        v-if="['v11'].includes(selectedSmrtLinkVersion.name)"
        label="5mc Calls In CpG Motifs"
        label-for="fivemc-calls-in-cpg-motifs"
      >
        <traction-select
          id="fivemc-calls-in-cpg-motifs"
          v-model="currentWell.fivemc_calls_in_cpg_motifs"
          :options="ccsAnalysisOutputOptions"
          data-attribute="fivemc-calls-in-cpg-motifs"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        v-if="['v11'].includes(selectedSmrtLinkVersion.name)"
        label="Demultiplex Barcodes"
        label-for="demultiplex-barcodes"
      >
        <traction-select
          id="demultiplex-barcodes"
          v-model="currentWell.demultiplex_barcodes"
          :options="generateHifiOptions[currentRun.system_name]"
          data-attribute="demultiplex-barcodes"
        >
        </traction-select>
      </traction-form-group>
    </traction-form>

    <traction-button
      id="disableAdaptiveLoadingBtn"
      theme="default"
      @click="disableAdaptiveLoadingInput()"
    >
      Disable Adaptive Loading
    </traction-button>

    <traction-table id="wellPools" stacked :items="currentWell.pools" :fields="wellPoolsFields">
      <template #table-caption>Pools</template>

      <template #cell(barcode)="row">
        <traction-form inline>
          <traction-input
            id="poolBarcode"
            ref="poolBarcode"
            :value="`${row.item.barcode}`"
            placeholder="Pool Barcode"
            @input="updatePoolBarcode(row, $event)"
          >
          </traction-input>

          <traction-button class="button btn-xs btn-danger" inline @click="removeRow(row)"
            >-</traction-button
          >
        </traction-form>
      </template>
    </traction-table>

    <traction-button class="button btn-xs btn-success" @click="addRow">+</traction-button>

    <template #modal-footer="{}">
      <traction-button
        v-if="action.label == 'Update'"
        id="deleteWellBtn"
        theme="delete"
        @click="removeWell()"
      >
        Delete well
      </traction-button>
      <traction-button :id="action.id" :theme="action.theme" @click="update()">
        {{ action.label }}
      </traction-button>
    </template>
  </traction-modal>
</template>

<script>
// There is a lot of duplication between this component and PacbioRunWellEdit.
// A lot of it could be moved to the store
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'WellModal',
  props: {
    position: {
      type: [String],
      required: true,
    },
    /* 
      we need this as by default static is false
      which means we can't test it.
      but when static is true it is displayed on top
      of the DOM so you can't see it
      Better to test in e2e or just get rid of the modal
      my preferred route as modals are awful
    */
    isStatic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentWell: {},
      action: {},
      movieTimeOptions: [
        { text: 'Movie Time', value: '', disabled: true },
        '10.0',
        '15.0',
        '20.0',
        '24.0',
        '30.0',
      ],
      wellPoolsFields: ['barcode'],
      generateHifiOptions: {
        '': [{ text: 'Please select a System Name', value: '', disabled: true }],
        'Sequel I': [
          { text: 'Please select a value', value: '', disabled: true },
          'In SMRT Link',
          'Do Not Generate',
        ],
        'Sequel II': [
          { text: 'Please select a value', value: '', disabled: true },
          'In SMRT Link',
          'Do Not Generate',
        ],
        'Sequel IIe': [
          { text: 'Please select a value', value: '', disabled: true },
          'In SMRT Link',
          'Do Not Generate',
          'On Instrument',
        ],
      },
      ccsAnalysisOutputOptions: ['Yes', 'No'],
      decimalPercentageRegex: /^(?:1(?:\.0{0,2})?|0?(?:\.\d{0,2})?)$/,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runs', ['currentRun', 'well']),
    ...mapGetters('traction/pacbio/pools', ['poolByBarcode']),
    selectedSmrtLinkVersion() {
      return Object.values(
        this.$store.getters['traction/pacbio/runCreate/smrtLinkVersionList'],
      ).find((version) => version.id === this.currentRun.smrt_link_version_id)
    },
  },
  methods: {
    addRow() {
      this.currentWell.pools.push({ id: '', barcode: '' })
    },
    removeRow(row) {
      this.currentWell.pools.splice(row.index, 1)
    },
    updateCCSAnalysisOutput() {
      if (this.currentWell.generate_hifi === 'Do Not Generate') {
        this.currentWell.ccs_analysis_output = 'No'
      }
    },
    formatLoadingTargetValue(val) {
      if (val) {
        if (this.decimalPercentageRegex.test(val)) {
          return val
        } else {
          return isNaN(this.loadingTargetValue) ? 0 : this.loadingTargetValue
        }
      }
    },
    disableAdaptiveLoadingInput() {
      this.currentWell.loading_target_p1_plus_p2 = ''
    },
    async showModalForPosition() {
      if (!this.well(this.position)) {
        this.currentWell = await this.buildWell(this.position)
        this.action = {
          id: 'createBtn',
          theme: 'create',
          label: 'Create',
        }
      } else {
        this.currentWell = { ...this.well(this.position) }
        this.action = {
          id: 'updateBtn',
          theme: 'update',
          label: 'Update',
        }
      }
      this.$refs['well-modal'].show()
    },
    async checkPools() {
      return await this.currentWell.pools.every((pool) => this.poolByBarcode(pool.barcode))
    },
    hide() {
      this.$refs['well-modal'].hide()
    },
    async update() {
      let validPools = await this.checkPools()
      if (validPools && this.action.label == 'Create') {
        this.createWell(this.currentWell)
        this.alert('Well created', 'success')
        this.hide()
      } else if (validPools && this.action.label == 'Update') {
        this.updateWell(this.currentWell)
        this.alert('Well updated', 'success')
        this.hide()
      } else {
        this.showAlert('Pool is not valid', 'danger')
      }
    },
    removeWell() {
      this.deleteWell(this.currentWell)
      this.alert('Well successfully deleted', 'success')
      this.hide()
    },
    async updatePoolBarcode(row, barcode) {
      let index = row.index
      let pool = await this.poolByBarcode(barcode)
      if (pool) {
        this.currentWell.pools[index] = { id: pool.id, barcode }
      } else {
        this.showAlert('Pool is not valid', 'danger')
      }
    },
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    ...mapActions('traction/pacbio/runs', ['buildWell']),
    ...mapMutations('traction/pacbio/runs', ['createWell', 'updateWell', 'deleteWell']),
  },
}
</script>
