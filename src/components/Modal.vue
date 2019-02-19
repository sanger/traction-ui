<template>
  <div>
    <b-btn :disabled="disabled" v-b-modal.enzymeModal>Create Libraries with Enzyme</b-btn>
    <b-modal id="enzymeModal" title="Create Libraries" ref="enzymeModal" @ok="handleOk" @shown="clearSelect">
      <b-form-select v-model="selectedEnzymeId" :options="enzymeOptions" class="mb-3" />
    </b-modal>
  </div>

</template>


<script>
import DataModel from '@/api/DataModel'
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'
import ComponentFactory from '@/mixins/ComponentFactory'

export default {
  name: 'Modal',
  mixins: [ComponentFactory],
  data () {
    return {
      selectedEnzymeId: null,
      enzymeOptions: []
    }
  },
  props: {
    disabled: Boolean,
  },
  methods: {
    clearSelect () {
      this.selectedEnzymeId = null
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()

      if (!this.selectedEnzymeId) {
        alert('Please select an enzyme')
      } else {
        this.handleSubmit()
      }
    },
    handleSubmit () {
      this.$emit('selectEnzyme', this.selectedEnzymeId)
      this.clearSelect()
      this.$refs.enzymeModal.hide()
    },
    async getEnzymeOptions() {
      this.enzymeOptions = [{ value: 1, text: "DV12" }]
      // await this.tractionApiEnzyme.get()
      //
      // if (this.tractionApiEnzyme.data !== null) {
      //   let enzymeOptions = this.tractionApiEnzyme.data.body.map((enzyme, index) => Object.assign({ value: index+1, text: enzyme.name }))
      //   enzymeOptions.unshift({ value: null, text: "Please select an option" })
      //   this.enzymeOptions = enzymeOptions
      // } else {
      //   this.message = this.tractionApiEnzyme.errors.message
      //   throw this.message
      // }
    },
  },
  async created() {
    this.getEnzymeOptions()
  },
  computed: {
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    },
    tractionApiEnzyme () {
      return this.build(DataModel, this.tractionConfig.resource('enzymes'))
    }
  }
}
</script>


<style>

</style>
