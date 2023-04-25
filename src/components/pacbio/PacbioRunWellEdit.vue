<template>
  <traction-modal ref="well-modal" :static="isStatic" size="lg">
    <template #modal-title> Add Pool to Well: {{ position }} </template>

    <fieldset>
      <traction-form-group v-for="field in smrtLinkWellDefaults" :key="field.name">
        <label>{{ field.label }}</label>
        <component
          :is="field.component"
          v-model="well[field.value]"
          v-bind="field.props"
          v-on="field.events"
        />
      </traction-form-group>
    </fieldset>

    <traction-table id="wellPools" stacked :items="localPools" :fields="wellPoolsFields">
      <template #table-caption>Pools</template>

      <template #cell(barcode)="row">
        <traction-form classes="flex flex-wrap items-center">
          <traction-input
            id="poolBarcode"
            ref="poolBarcode"
            :value="`${row.item.barcode}`"
            placeholder="Pool Barcode"
            :debounce="500"
            @input="updatePoolBarcode(row, $event)"
          >
          </traction-input>

          <traction-button class="button btn-xs btn-danger" @click="removeRow(row)"
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
      wellPoolsFields: [{ key: 'barcode', label: 'Barcode' }],
      smrtLinkVersionComponents: {
        v10: [],
        v11: [
          {
            name: 'movie_time',
            component: 'traction-select',
            value: 'movie_time',
            label: 'Move time: ',
            props: {
              options: [
                { text: 'Movie Time', value: '', disabled: true },
                '10.0',
                '15.0',
                '20.0',
                '24.0',
                '30.0',
              ],
              dataAttribute: 'movie-time',
            },
          },
          {
            name: 'on_plate_loading_concentration',
            component: 'traction-input',
            value: 'on_plate_loading_concentration',
            label: 'On Plate Loading Concentration (pM):',
            props: {
              placeholder: 'On Plate Loading Concentration (pM)',
              dataAttribute: 'on-plate-loading-concentration',
            },
          },
          {
            name: 'pre-extension-time',
            component: 'traction-input',
            value: 'pre_extension_time',
            label: 'Pre-extension time (hours):',
            props: {
              placeholder: 'Pre-extension time',
              dataAttribute: 'pre-extension-time',
            },
          },
          {
            name: 'binding_kit_box_barcode',
            component: 'traction-input',
            value: 'binding_kit_box_barcode',
            label: 'Binding Kit Box Barcode:',
            props: {
              dataAttribute: 'binding-kit-box-barcode',
              placeholder: 'Binding Kit Box Barcode',
            },
          },
          {
            name: 'loading_target_p1_plus_p2',
            component: 'traction-input',
            value: 'loading_target_p1_plus_p2',
            label: 'Loading Target (P1 + P2): (0 to 1)',
            props: {
              type: 'number',
              step: 0.05,
              min: 0,
              max: 1,
              dataAttribute: 'loading-target-p1-plus-p2',
              placeholder: 'Adaptive loading disabled - Add loading target to enable',
              formatter: this.formatLoadingTargetValue,
            },
          },
          {
            name: 'ccs_analysis_output_include_kinetics_information',
            component: 'traction-select',
            value: 'ccs_analysis_output_include_kinetics_information',
            label: 'CCS Analysis Output Include Kinetics Information:',
            props: {
              options: ['Yes', 'No'],
              dataAttribute: 'ccs-analysis-output-include-kinetics-information',
            },
          },
          {
            name: 'ccs_analysis_output_include_low_quality_reads',
            component: 'traction-select',
            value: 'ccs_analysis_output_include_low_quality_reads',
            label: 'CCS Analysis Output Include Low Quality Reads:',
            props: {
              options: ['Yes', 'No'],
              dataAttribute: 'ccs-analysis-output-include-low-quality-reads',
            },
          },
          {
            name: 'include_fivemc_calls_in_cpg_motifs',
            component: 'traction-select',
            attribute: 'include_fivemc_calls_in_cpg_motifs',
            label: 'Include 5mc Calls In CpG Motifs:',
            props: {
              options: ['Yes', 'No'],
              dataAttribute: 'include-fivemc-calls-in-cpg-motifs',
              placeholder: 'Include 5mc Calls in CpG Motifs for new wells',
            },
          },
          {
            name: 'demultiplex_barcodes',
            component: 'traction-select',
            value: 'demultiplex_barcodes',
            label: 'Demultiplex barcodes:',
            props: {
              options: [
                { text: 'Please select a value', value: '', disabled: true },
                'In SMRT Link',
                'Do Not Generate',
                'On Instrument',
              ],
              dataAttribute: 'demultiplex-barcodes',
            },
          },
          {
            name: 'disableAdaptiveLoadingBtn',
            component: 'traction-button',
            value: 'disable_adaptive_loading',
            props: {
              text: 'Disable Adaptive Loading',
              theme: 'default',
            },
            events: {
              click: this.disableAdaptiveLoadingInput,
            },
          },
        ],
        v12_revio: [
          {
            name: 'movie_acquisition_time',
            component: 'traction-input',
            value: 'movie_acquisition_time',
            label: 'Movie Acquisition Time (hrs):',
            props: {
              type: 'number',
              step: 1,
              max: 30,
              min: 0.1,
              dataAttribute: 'movie-acquisition-time',
              placeholder: 'Movie Acquisition Time',
            },
          },
          {
            name: 'include_base_kinetics',
            component: 'traction-select',
            value: 'include_base_kinetics',
            label: 'Include Base Kinetics: ',
            props: {
              options: ['True', 'False'],
              dataAttribute: 'include-base-kinetics',
              placeholder: 'Include Base Kinetics',
            },
          },
          {
            name: 'library_concentration',
            component: 'traction-input',
            value: 'library_concentration',
            label: 'Library Concentration: ',
            props: {
              type: 'number',
              dataAttribute: 'library-concentration',
              placeholder: 'Library Concentration',
            },
          },
          {
            name: 'polymerase_kit',
            component: 'traction-input',
            value: 'polymerase_kit',
            label: 'Polymerase Kit ',
            props: {
              type: 'number',
              dataAttribute: 'polymerase-kit',
              placeholder: 'Polymerase Kit',
            },
          },
          {
            name: 'pre-extension-time',
            component: 'traction-input',
            value: 'pre_extension_time',
            label: 'Pre-extension time:',
            props: {
              placeholder: 'Pre-extension time',
              dataAttribute: 'pre-extension-time',
            },
          },
        ],
      },
      decimalPercentageRegex: /^(?:1(?:\.0{0,2})?|0?(?:\.\d{0,2})?)$/,
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runCreate', [
      'poolByBarcode',
      'smrtLinkVersion',
      'getWell',
      'pools',
      'runItem',
    ]),
    smrtLinkWellDefaults() {
      return this.smrtLinkVersionComponents[this.smrtLinkVersion.name]
    },
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
    removeInvalidPools() {
      this.localPools = this.localPools.filter((pool) => pool.id && pool.barcode)
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
          return isNaN(this.well.loading_target_p1_plus_p2)
            ? 0
            : this.well.loading_target_p1_plus_p2
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
      this.removeInvalidPools()
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
      const pool = await this.poolByBarcode(barcode)
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
        const pool = this.pools.find((pool) => pool.id == id)
        this.localPools.push({ id, barcode: pool.barcode })
      })
    },
  },
}
</script>
