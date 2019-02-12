<template>
  <div>
    <b-btn :disabled="disabled" v-b-modal.enzymeModal>Create Libraries with Enzyme</b-btn>
    <b-modal id="enzymeModal" title="Create Libraries" ref="enzymeModal" @ok="handleOk" @shown="clearSelect">
      <b-form-select v-model="selectedEnzymeId" :options="options" class="mb-3" />
    </b-modal>
  </div>

</template>


<script>

export default {
  name: 'Modal',
  data () {
    return {
      selectedEnzymeId: null,
      options: [
        { value: null, text: 'Please select an option' },
        { value: 1, text: 'Nb.BsmI' },
        { value: 2, text: 'Nt.BspQI' },
        { value: 3, text: 'Nb.BssSI' },
        { value: 4, text: 'DLE-1' }
      ]
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
    }
  },
  computed: {
  }
}
</script>


<style>

</style>
