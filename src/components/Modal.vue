<template>

  <div class="modal">
    <b-btn id="createLibrariesWithEnzymeButton" :disabled="disabled" v-b-modal.enzymeModal>Create Libraries with Enzyme</b-btn>
    <b-modal id="enzymeModal" title="Create Libraries" ref="enzymeModal" :static="isStatic" @ok="handleOk" @shown="clearSelect">
      <b-form-select v-model="selectedEnzymeId" :options="enzymeOptions" class="mb-3" />
    </b-modal>
  </div>

</template>

<script>
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'

export default {
  name: 'Modal',
  mixins: [Api],
  data () {
    return {
      selectedEnzymeId: null,
      enzymeOptions: []
    }
  },
  props: {
    disabled: Boolean,
    isStatic: Boolean
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
      let promise = this.enzymeRequest.get()
      let response = await handlePromise(promise)

      if (response.successful) {
        let enzymes = response.deserialize.enzymes
        let enzymeOptions = enzymes.map((enzyme, index) => Object.assign({ value: index+1, text: enzyme.name }))
        enzymeOptions.unshift({ value: null, text: "Please select an option" })
        this.enzymeOptions = enzymeOptions
      } else {
        this.message = response.errors.message
      }
    },
    async provider () {
      this.getEnzymeOptions()
    }
  },
  async created() {
    this.provider()
  },
  components: {
  },
  computed: {
    enzymeRequest () {
      return this.api.traction.enzymes
    }
  }
}
</script>


<style>

.modal {
  display: inline;
  position: relative;
}

</style>
