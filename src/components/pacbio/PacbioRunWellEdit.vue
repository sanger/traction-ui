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

    <traction-table id="wellPools" stacked :items="well.pools" :fields="wellPoolsFields">
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
      smrtLinkVersion: {},
      well: {},
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
    ...mapGetters('traction/pacbio/runCreate', ['poolByBarcode']),
  },
  created() {
    this.well = this.getWell({ position: this.position })
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
      const validPools = await this.checkPools()
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
      const index = row.index
      await this.$store.dispatch('traction/pacbio/runCreate/findPools', { barcode: barcode })
      const pool = await this.poolByBarcode(barcode)
      if (pool) {
        this.currentWell.pools[index] = { id: pool.id, barcode }
      } else {
        this.showAlert('Pool is not valid', 'danger')
      }
    },
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    ...mapActions('traction/pacbio/runCreate', ['getWell']),
    ...mapMutations('traction/pacbio/runs', ['createWell', 'updateWell', 'deleteWell']),
  },
}
</script>
