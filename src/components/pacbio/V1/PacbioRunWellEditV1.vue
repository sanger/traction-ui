<template>
  <traction-modal ref="well-modal" :static="isStatic" size="lg" :visible="isShow" @cancel="hide">
    <template #modal-title>Add Pool or Library to Well: {{ position }}</template>

    <fieldset>
      <traction-form v-for="field in smrtLinkWellDefaults" :key="field.name">
        <div class="pb-2">
          <label>{{ field.label }}</label>
          <component
            :is="field.component"
            v-model="well[field.value]"
            v-bind="handleCustomProps(field)"
            v-on="handleCustomEvents(field)"
          />
        </div>
      </traction-form>
    </fieldset>

    <traction-table
      id="wellPoolsAndLibraries"
      stacked
      :items="localPoolsAndLibraries"
      :fields="wellPoolsLibrariesFields"
    >
      <template #table-caption>Pools</template>

      <template #cell(barcode)="row">
        <traction-form classes="flex flex-wrap items-center">
          <traction-input
            id="poolLibraryBarcode"
            ref="poolLibraryBarcode"
            :model-value="`${row.item.barcode}`"
            placeholder="Pool/Library barcode"
            :debounce="500"
            @update:model-value="updatePoolLibraryBarcode(row, $event)"
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
import { mapState, mapActions } from 'pinia'
import PacbioRunWellComponents from '@/config/PacbioRunWellComponents'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'

export default {
  name: 'WellModal',
  props: {
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
  emits: ['alert'],
  data() {
    return {
      well: {},
      localPoolsAndLibraries: [],
      wellPoolsLibrariesFields: [{ key: 'barcode', label: 'Barcode' }],
      decimalPercentageRegex: /^(?:1(?:\.0{0,2})?|0?(?:\.\d{0,2})?)$/,
      isShow: false,
      position: '',
      plateNumber: '',
    }
  },
  computed: {
    ...mapState(usePacbioRunCreateStore, [
      'tubeContentByBarcode',
      'smrtLinkVersion',
      'getWell',
      'tubeContents',
      'getOrCreateWell',
    ]),
    smrtLinkWellDefaults() {
      return PacbioRunWellComponents[this.smrtLinkVersion.name]
    },
    newWell() {
      // Check if well exists in state
      return !this.getWell(this.plateNumber, this.position)
    },
    // this is needed to update the well. We need to make sure we have the
    // right pools and libraries
    wellPayload() {
      return {
        ...this.well,
        pools: this.idsByType('pools'),
        libraries: this.idsByType('libraries'),
      }
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
  },
  methods: {
    ...mapActions(usePacbioRunCreateStore, [
      'updateWell',
      'deleteWell',
      'findPoolsOrLibrariesByTube',
    ]),
    addRow() {
      this.localPoolsAndLibraries.push({ id: '', barcode: '' })
    },
    idsByType(type) {
      return this.localPoolsAndLibraries.filter((item) => item.type === type).map((item) => item.id)
    },
    removeRow(row) {
      this.localPoolsAndLibraries.splice(row.index, 1)
    },
    removeInvalidPools() {
      this.localPoolsAndLibraries = this.localPoolsAndLibraries.filter(
        (item) => item.id && item.barcode,
      )
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
    async showModalForPositionAndPlate(position, plateNumber) {
      position ? (this.position = position) : ''
      plateNumber ? (this.plateNumber = plateNumber) : ''
      // We also need to setup the well here in case state has updated since
      await this.setupWell()
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    async update() {
      this.removeInvalidPools()
      this.updateWell({ well: this.wellPayload, plateNumber: this.plateNumber })
      this.alert('Well created', 'success')
      this.hide()
    },
    removeWell() {
      // This currently updates the well object key `<position>_destroy`
      this.deleteWell({ well: this.wellPayload, plateNumber: this.plateNumber })
      this.alert('Well successfully deleted', 'success')
      this.hide()
    },
    async updatePoolLibraryBarcode(row, barcode) {
      const index = row.index
      await this.findPoolsOrLibrariesByTube({ barcode })
      const tubeContent = await this.tubeContentByBarcode(barcode)
      if (tubeContent) {
        tubeContent.type === 'libraries'
          ? (this.localPoolsAndLibraries[index] = {
              id: tubeContent.id,
              barcode,
              type: 'libraries',
            })
          : tubeContent.type === 'pools'
            ? (this.localPoolsAndLibraries[index] = { id: tubeContent.id, barcode, type: 'pools' })
            : null
      } else {
        this.showAlert('Pool is not valid', 'danger')
      }
    },
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    async setupWell() {
      this.well = await this.getOrCreateWell(this.position, this.plateNumber)
      console.log(this.well)
      // We need to flush localPools to prevent duplicates
      this.localPoolsAndLibraries = []
      // If the well has pools we want the barcode and id of each to display
      this.well.pools?.forEach((id) => {
        const pool = this.tubeContents.find((tubeContent) => tubeContent.id == id)
        pool ? this.localPoolsAndLibraries.push({ id, barcode: pool.barcode, type: 'pools' }) : null
      })
      // If the well has libraries we want the barcode and id of each to display
      this.well.libraries?.forEach((id) => {
        const library = this.tubeContents.find((tubeContent) => tubeContent.id == id)
        library
          ? this.localPoolsAndLibraries.push({ id, barcode: library.barcode, type: 'libraries' })
          : null
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
      return { ...component.events }
    },
  },
}
</script>
