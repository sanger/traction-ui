<template>
  <b-modal ref="well-modal" size="lg">
    <template v-slot:modal-title :position="position"> Add Pool to Well: {{ position }} </template>

    <alert ref="alert"></alert>

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
    </b-form>

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
      <b-button :id="action.id" :variant="action.variant" @click="checkAction()">
        {{ action.label }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
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
      currentWell: {},
      movieTimeOptions: [{ text: 'Movie Time', value: '' }, '15.0', '20.0', '24.0', '30.0'],
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
      ccsAnalysisOutputOptions: [
        { text: 'Please select a CCS Analysis Output', value: '', disabled: true },
        'Yes',
        'No',
      ],
      action: {},
    }
  },
  computed: {
    showCCSAnalysisOutput() {
      return this.currentWell.generate_hifi == ('In SMRT Link' || 'On Instrument')
    },
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
    async showModalForPosition() {
      if (!this.well(this.position)) {
        this.currentWell = await this.buildWell(this.position)
        this.action = {
          id: 'create',
          variant: 'success',
          label: 'Create',
        }
      } else {
        this.currentWell = { ...this.well(this.position) }
        this.action = {
          id: 'update',
          variant: 'primary',
          label: 'Update',
        }
      }
      this.$refs['well-modal'].show()
    },
    checkAction() {
      this.action.id == 'create' ? this.createAndFormatWell() : this.update()
    },
    async checkPools() {
      return await this.currentWell.pools.every(
        (pool) => this.poolByBarcode(pool.barcode) !== undefined,
      )
    },
    hide() {
      this.$refs['well-modal'].hide()
    },
    async createAndFormatWell() {
      this.currentWell.ccs_analysis_output =
        this.currentWell.generate_hifi == 'Do Not Generate' ? 'No' : 'Yes'
      let validPools = await this.checkPools()
      if (validPools) {
        this.createWell(this.currentWell)
        this.alert('Well created', 'success')
        this.hide()
      } else {
        this.showAlert('Pool is not valid', 'danger')
      }
    },
    async update() {
      let validPools = await this.checkPools()
      if (validPools) {
        this.updateWell(this.currentWell)
        this.alert('Well updated', 'success')
        this.hide()
      } else {
        this.showAlert('Pool is not valid', 'danger')
      }
    },
    removeWell() {
      this.deleteWell(this.position)
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
    ...mapActions('traction/pacbio/runs', ['buildWell']),
    ...mapMutations('traction/pacbio/runs', ['createWell', 'updateWell', 'deleteWell']),
    alert(message, type) {
      this.$emit('alert', message, type)
    },
  },
}
</script>
