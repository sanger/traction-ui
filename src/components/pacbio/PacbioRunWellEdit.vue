<template>
  <traction-modal ref="well-modal" :static="isStatic" size="lg">
    <template #modal-title> Add Pool to Well: {{ position }} </template>

    <fieldset>
      <traction-form-group v-for="field in smrtLinkWellDefaults" :key="field.name">
        <label>{{ field.label }}</label>
        <component
          :is="field.component"
          v-bind="field.props"
          v-model="getWell(position)[field.value]"
        />
      </traction-form-group>
    </fieldset>

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
import { smrtLinkVersionDefaultComponents } from '@/store/traction/pacbio/runCreate/run'

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
      'runItem',
    ]),
    smrtLinkWellDefaults() {
      return smrtLinkVersionDefaultComponents[this.smrtLinkVersion.name]
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
