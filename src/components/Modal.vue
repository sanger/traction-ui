<template>
  <div>
    <b-btn :disabled="disabled" v-b-modal.enzymeModal>Create Libraries with Enzyme</b-btn>
    <b-modal id="enzymeModal" title="Create Libraries" ref="enzymeModal" @ok="handleOk" @shown="clearSelect">
      <b-form-select v-model="selectedEnzymeId" :options="enzymeOptions" class="mb-3" />
    </b-modal>
  </div>

</template>


<script>
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'
import ComponentFactory from '@/mixins/ComponentFactory'
import Request from '@/api/Request'
import Response from '@/api/Response'

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
    async getEnzymeOptions () {
      let rawResponse = await this.enzymeRequest.get()
      let response = new Response(rawResponse)

      if (Object.keys(response.errors).length === 0) {
        let enzymes = response.deserialize.enzymes
        let enzymeOptions = enzymes.map((enzyme, index) => Object.assign({ value: index+1, text: enzyme.name }))
        enzymeOptions.unshift({ value: null, text: "Please select an option" })
        this.enzymeOptions = enzymeOptions
      } else {
        this.message = response.errors.message
        throw this.message
      }
    },
  },
  async created() {
    this.getEnzymeOptions()
  },
  computed: {
    enzymeRequest () {
      return this.build(Request, this.tractionConfig.resource('enzymes'))
    },
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    }
  }
}
</script>


<style>

</style>
