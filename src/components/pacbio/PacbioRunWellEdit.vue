<template>
  <traction-modal ref="well-modal" :static="isStatic" size="lg" :visible="isShow" @cancel="hide">
    <template #modal-title>Add Pool to Well: {{ position }}</template>

    <fieldset>
      <traction-form v-for="field in smrtLinkWellDefaults" :key="field.name">
        <label>{{ field.label }}</label>
        <component
          :is="field.component"
          v-model="well[field.value]"
          v-bind="handleCustomProps(field)"
          class="pb-2"
          v-on="handleCustomEvents(field)"
        />
      </traction-form>
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
          ></traction-input>

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
        >Delete well</traction-button
      >
      <traction-button
        :id="action.id"
        :data-action="action.dataAction"
        :theme="action.theme"
        @click="update()"
        >{{ action.label }}</traction-button
      >
    </template>
  </traction-modal>
</template>

<script>
// There is a lot of duplication between this component and PacbioRunWellEdit.
// A lot of it could be moved to the store
import { mapGetters, mapActions } from 'vuex'
import PacbioRunWellComponents from '@/config/PacbioRunWellComponents'

const PLATE_INDEX = 0

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
      decimalPercentageRegex: /^(?:1(?:\.0{0,2})?|0?(?:\.\d{0,2})?)$/,
      isShow: false,
      positionData: this.position,
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
      return PacbioRunWellComponents[this.smrtLinkVersion.name]
    },
    newWell() {
      // Check if well exists in state
      return !this.getWell(this.positionData, PLATE_INDEX)
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
    ...mapActions('traction/pacbio/runCreate', ['getOrCreateWell', 'updateWell', 'deleteWell']),
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
    async showModalForPosition(position) {
      if (position) {
        this.positionData = position
      }
      // We also need to setup the well here in case state has updated since
      await this.setupWell()
      this.isShow = true
      /**This need to be removed when custom_enable_modal feature flag is removed */
      if ('b-modal' in this.$refs['well-modal'].$refs) {
        this.$refs['well-modal'].$refs['b-modal'].show()
      }
    },
    hide() {
      this.isShow = false
      /**This need to be removed when custom_enable_modal feature flag is removed */
      if ('b-modal' in this.$refs['well-modal'].$refs) {
        this.$refs['well-modal'].$refs['b-modal'].hide()
      }
    },
    async update() {
      this.removeInvalidPools()
      this.updateWell({ well: this.wellPayload, plateIndex: PLATE_INDEX })
      this.alert('Well created', 'success')
      this.hide()
    },
    removeWell() {
      // TODO DPl-746:
      // Both Traction UI/ Service don't support deleting a well
      // and adding a new well back in the same position
      this.deleteWell({ well: this.wellPayload, plateIndex: PLATE_INDEX })
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
      this.well = await this.getOrCreateWell({
        position: this.positionData,
        plateIndex: PLATE_INDEX,
      })
      // We need to flush localPools to prevent duplicates
      this.localPools = []
      // If the well has pools we want the barcode and id of each to display
      this.well.pools?.forEach((id) => {
        const pool = this.pools.find((pool) => pool.id == id)
        this.localPools.push({ id, barcode: pool.barcode })
      })
    },
    handleCustomProps(component) {
      if (component.name == 'loading_target_p1_plus_p2') {
        return {
          ...component.props,
          formatter: this.formatLoadingTargetValue,
        }
      }
      return component.props
    },
    handleCustomEvents(component) {
      if (component.name == 'disableAdaptiveLoadingBtn') {
        return {
          ...component.events,
          click: this.disableAdaptiveLoadingInput,
        }
      }
      return component.events
    },
  },
}
</script>
