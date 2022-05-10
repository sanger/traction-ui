<template>
  <b-modal ref="well-modal" size="lg">
    <template v-slot:modal-title :position="position"> Add Pool to Well: {{ position }} </template>

    <b-form>
      <b-form-group id="movieTime-group" label="Movie time:" label-for="movieTime">
        <b-form-select
          id="movieTime"
          ref="movieTime"
          v-model="currentWell.movie_time"
          :options="movieTimeOptions"
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
          v-model="currentWell.on_plate_loading_concentration"
          placeholder="On Plate Loading Concentration (mP)"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group id="generateHiFi-group" label="Generate HiFi Reads:" label-for="generateHiFi">
        <b-form-select
          id="generateHiFi"
          ref="generateHiFi"
          v-model="currentWell.generate_hifi"
          :options="generateHifiOptions[currentRun.system_name]"
          @change="updateCCSAnalysisOutput"
        >
        </b-form-select>
      </b-form-group>

      <b-form-group
        id="ccsAnalysisOutput-group"
        label="CCS Analysis Output - Include Kinetics Information:"
        label-for="ccsAnalysisOutput"
      >
        <b-form-select
          id="ccsAnalysisOutput"
          ref="ccsAnalysisOutput"
          v-model="currentWell.ccs_analysis_output"
          :options="ccsAnalysisOutputOptions"
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
          v-model="currentWell.pre_extension_time"
          placeholder="Pre-extension time"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group
        id="bindingKitBoxBarcode-group"
        label="Binding Kit Box Barcode: "
        label-for="bindingKitBoxBarcode"
      >
        <b-form-input
          id="bindingKitBoxBarcode"
          ref="bindingKitBoxBarcode"
          v-model="currentWell.binding_kit_box_barcode"
          placeholder="Binding Kit Box Barcode"
        >
        </b-form-input>
      </b-form-group>
      <b-form-group
        id="loadingTarget-group"
        label="Loading Target (P1 + P2): (0 to 1) "
        label-for="loadingTarget"
      >
        <b-form-input
          id="loadingTarget"
          ref="loadingTarget"
          v-model="currentWell.loading_target_p1_plus_p2"
          :placeholder="loadingTargetText"
          type="number"
          :min="0"
          :max="1"
          :step="0.05"
          lazy-formatter
          :formatter="formatLoadingTargetValue"
        >
        </b-form-input>
      </b-form-group>
    </b-form>

    <template>
      <b-button
        id="disableAdaptiveLoadingBtn"
        variant="primary"
        @click="disableAdaptiveLoadingInput()"
      >
        Disable Adaptive Loading
      </b-button>
    </template>

    <b-table id="wellPools" stacked :items="currentWell.pools" :fields="wellPoolsFields">
      <template v-slot:table-caption>Pools</template>

      <template v-slot:cell(barcode)="row">
        <b-form inline>
          <b-form-input
            id="poolBarcode"
            ref="poolBarcode"
            :value="`${row.item.barcode}`"
            placeholder="Pool Barcode"
            @change="updatePoolBarcode(row, $event)"
          >
          </b-form-input>

          <b-button class="button btn-xs btn-danger" inline @click="removeRow(row)">-</b-button>
        </b-form>
      </template>
    </b-table>

    <b-button class="button btn-xs btn-success" @click="addRow">+</b-button>

    <template v-slot:modal-footer="{ ok }">
      <b-button
        v-if="action.label == 'Update'"
        id="deleteWellBtn"
        variant="danger"
        @click="removeWell()"
      >
        Delete well
      </b-button>
      <b-button :id="action.id" :variant="action.variant" @click="update()">
        {{ action.label }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'WellModal',
  props: {
    position: {
      type: [String],
      required: true,
    },
  },
  data() {
    return {
      currentWell: {},
      action: {},
      movieTimeOptions: [
        { text: 'Movie Time', value: '', disabled: true },
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
      loadingTargetValue: 0,
      disableAdaptiveLoading: false,
      loadingTargetText: 'Loading Target (P1 + P2)',
    }
  },
  computed: {
    ...mapGetters('traction/pacbio/runs', ['currentRun', 'well']),
    ...mapGetters('traction/pacbio/pools', ['poolByBarcode']),
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
      this.use_adaptive_loading = 'False'
      this.loadingTargetText = 'Adaptive loading disabled - Add loading target to enable'
    },
    async showModalForPosition() {
      if (!this.well(this.position)) {
        this.currentWell = await this.buildWell(this.position)
        this.action = {
          id: 'createBtn',
          variant: 'success',
          label: 'Create',
        }
      } else {
        this.currentWell = { ...this.well(this.position) }
        this.action = {
          id: 'updateBtn',
          variant: 'primary',
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
