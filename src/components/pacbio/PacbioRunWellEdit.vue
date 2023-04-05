<template>
  <traction-modal ref="well-modal" :static="isStatic" size="lg">
    <template #modal-title> Add Pool to Well: {{ position }} </template>

    <traction-form>
      <traction-form-group id="movie-time-group" label="Movie time:" label-for="movie-time">
        <traction-select
          id="movie-time"
          ref="movieTime"
          v-model="well.movie_time"
          data-attribute="movie-time"
          :options="movieTimeOptions"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        id="on-plate-loading-concentration-group"
        label="On Plate Loading Concentration (pM):"
        label-for="on-plate-loading-concentration"
      >
        <traction-input
          id="on-plate-loading-concentration"
          ref="onPlateLoadingConcentration"
          v-model="well.on_plate_loading_concentration"
          data-attribute="on-plate-loading-concentration"
          placeholder="On Plate Loading Concentration (pM)"
        >
        </traction-input>
      </traction-form-group>

      <traction-form-group
        v-if="['v10'].includes(smrtLinkVersion.name)"
        id="generate-hifi-group"
        label="Generate HiFi Reads:"
        label-for="generate-hifi"
      >
        <traction-select
          id="generate-hifi"
          ref="generateHiFi"
          v-model="well.generate_hifi"
          data-attribute="generate-hifi"
          :options="generateHifiOptions"
          @input="updateCCSAnalysisOutput"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        v-if="['v10'].includes(smrtLinkVersion.name)"
        id="ccs-analysis-output-group"
        label="CCS Analysis Output - Include Kinetics Information:"
        label-for="ccs-analysis-output"
      >
        <traction-select
          id="ccs-analysis-output"
          ref="ccsAnalysisOutput"
          v-model="well.ccs_analysis_output"
          data-attribute="ccs-analysis-output"
          :options="ccsAnalysisOutputOptions"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        id="pre-extension-time-group"
        label="Pre-extension time (hours):"
        label-for="pre-extension-time"
      >
        <traction-input
          id="pre-extension-time"
          ref="preExtensionTime"
          v-model="well.pre_extension_time"
          data-attribute="pre-extension-time"
          placeholder="Pre-extension time"
        >
        </traction-input>
      </traction-form-group>

      <traction-form-group
        id="binding-kit-box-barcode-group"
        label="Binding Kit Box Barcode: "
        label-for="binding-kit-box-barcode"
      >
        <traction-input
          id="binding-kit-box-barcode"
          ref="bindingKitBoxBarcode"
          v-model="well.binding_kit_box_barcode"
          data-attribute="binding-kit-box-barcode"
          placeholder="Binding Kit Box Barcode"
        >
        </traction-input>
      </traction-form-group>
      <traction-form-group
        id="loading-target-p1-plus-p2-group"
        label="Loading Target (P1 + P2): (0 to 1) "
        label-for="loading-target-p1-plus-p2"
      >
        <traction-input
          id="loading-target"
          ref="loadingTarget"
          v-model="well.loading_target_p1_plus_p2"
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
        v-if="['v11'].includes(smrtLinkVersion.name)"
        label="CCS Output Include Kinetics Information"
        label-for="ccs-analysis-output-include-kinetics-information"
      >
        <traction-select
          id="ccs-analysis-output-include-kinetics-information"
          v-model="well.ccs_analysis_output_include_kinetics_information"
          :options="ccsAnalysisOutputOptions"
          data-attribute="ccs-analysis-output-include-kinetics-information"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        v-if="['v11'].includes(smrtLinkVersion.name)"
        label="CCS Analysis Output Include Low Quality Reads"
        label-for="ccs-analysis-output-include-low-quality-reads"
      >
        <traction-select
          id="ccs-analysis-output-include-low-quality-reads"
          v-model="well.ccs_analysis_output_include_low_quality_reads"
          :options="ccsAnalysisOutputOptions"
          data-attribute="ccs-analysis-output-include-low-quality-reads"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        v-if="['v11'].includes(smrtLinkVersion.name)"
        label="Include 5mc Calls In CpG Motifs"
        label-for="include-fivemc-calls-in-cpg-motifs"
      >
        <traction-select
          id="include-fivemc-calls-in-cpg-motifs"
          v-model="well.include_fivemc_calls_in_cpg_motifs"
          :options="ccsAnalysisOutputOptions"
          data-attribute="include-fivemc-calls-in-cpg-motifs"
        >
        </traction-select>
      </traction-form-group>

      <traction-form-group
        v-if="['v11'].includes(smrtLinkVersion.name)"
        label="Demultiplex Barcodes"
        label-for="demultiplex-barcodes"
      >
        <traction-select
          id="demultiplex-barcodes"
          v-model="well.demultiplex_barcodes"
          :options="generateHifiOptions"
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

    <traction-table id="wellPools" stacked :items="localPools" :fields="wellPoolsFields">
      <template #table-caption>Pools</template>

      <template #cell(barcode)="row">
        <traction-form inline>
          <traction-input
            id="poolBarcode"
            ref="poolBarcode"
            :value="`${row.item.barcode}`"
            placeholder="Pool Barcode"
            :debounce="500"
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
        v-if="!newWell"
        id="delete-well"
        data-action="delete-well"
        theme="delete"
        @click="removeWell()"
      >
        Delete well
      </traction-button>
      <traction-button
        :id="action.id"
        :data-action="action.dataAction"
        :theme="action.theme"
        @click="update()"
      >
        {{ action.label }}
      </traction-button>
    </template>
  </traction-modal>
</template>

<script>
// There is a lot of duplication between this component and PacbioRunWellEdit.
// A lot of it could be moved to the store
import { mapGetters, mapActions, mapMutations } from 'vuex'

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
      well: {},
      localPools: [],
      movieTimeOptions: [
        { text: 'Movie Time', value: '', disabled: true },
        '10.0',
        '15.0',
        '20.0',
        '24.0',
        '30.0',
      ],
      wellPoolsFields: [{ key: 'barcode', label: 'Barcode' }],
      generateHifiOptions: [
        { text: 'Please select a value', value: '', disabled: true },
        'In SMRT Link',
        'Do Not Generate',
        'On Instrument',
      ],
      ccsAnalysisOutputOptions: ['Yes', 'No'],
      decimalPercentageRegex: /^(?:1(?:\.0{0,2})?|0?(?:\.\d{0,2})?)$/,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runCreate', [
      'poolByBarcode',
      'smrtLinkVersion',
      'getWell',
      'pools',
    ]),
    newWell() {
      // Check if well exists in state
      return !this.getWell(this.position)
    },
    // this is needed to update the well. We need to make sure we have the
    // right pools
    wellPayload() {
      return { ...this.well, pools: this.poolIds }
    },
    action() {
      return this.newWell
        ? {
            id: 'create',
            dataAction: 'create-well',
            theme: 'create',
            label: 'Create',
          }
        : {
            id: 'update',
            dataAction: 'update-well',
            theme: 'update',
            label: 'Update',
          }
    },
    poolIds() {
      return this.localPools.map((pool) => pool.id)
    },
  },
  methods: {
    ...mapActions('traction/pacbio/runCreate', ['getOrCreateWell', 'updateWell']),
    ...mapMutations('traction/pacbio/runCreate', ['deleteWell']),
    addRow() {
      this.localPools.push({ id: '', barcode: '' })
    },
    removeRow(row) {
      this.localPools.splice(row.index, 1)
    },
    updateCCSAnalysisOutput() {
      if (this.well.generate_hifi === 'Do Not Generate') {
        this.well.ccs_analysis_output = 'No'
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
      this.well.loading_target_p1_plus_p2 = ''
    },
    async showModalForPosition() {
      // We also need to setup the well here in case state has updated since
      await this.setupWell()
      this.$refs['well-modal'].show()
    },
    hide() {
      this.$refs['well-modal'].hide()
    },
    async update() {
      this.updateWell(this.wellPayload)
      this.alert('Well created', 'success')
      this.hide()
    },
    removeWell() {
      this.deleteWell(this.position)
      this.alert('Well successfully deleted', 'success')
      this.hide()
    },
    async updatePoolBarcode(row, barcode) {
      const index = row.index
      await this.$store.dispatch('traction/pacbio/runCreate/findPools', { barcode: barcode })
      const pool = this.poolByBarcode(barcode)
      if (pool) {
        this.localPools[index] = { id: pool.id, barcode }
      } else {
        this.showAlert('Pool is not valid', 'danger')
      }
    },
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    async setupWell() {
      this.well = await this.getOrCreateWell({ position: this.position })
      // We need to flush localPools to prevent duplicates
      this.localPools = []
      // If the well has pools we want the barcode and id of each to display
      this.well.pools?.forEach((id) => {
        const pool = this.pools.find((pool) => pool.id === id)
        this.localPools.push({ id, barcode: pool.barcode })
      })
    },
  },
}
</script>
