<template>
  <div>
    <traction-button
      id="createLibrariesWithEnzymeButton"
      :disabled="disabled"
      theme="create"
      @click="displayModal"
    >
      Create Libraries
    </traction-button>
    <traction-modal
      id="enzymeModal"
      ref="enzymeModal"
      size="sm"
      title="Create Libraries"
      :visible="showModal"
      :static="isStatic"
      @ok="handleOk"
      @shown="clearSelect"
    >
      <traction-select v-model="selectedEnzymeId" :options="enzymeOptions" class="mb-3" />
    </traction-modal>
  </div>
</template>

<script>
import handlePromise from '@/api/v1/PromiseHelper'

export default {
  name: 'SaphyrEnzymeModal',
  props: {
    disabled: Boolean,
    isStatic: Boolean,
  },
  emits: ['selectEnzyme'],
  data() {
    return {
      selectedEnzymeId: null,
      enzymeOptions: [],
      showModal: false,
    }
  },
  computed: {
    api() {
      return this.$store.getters.api
    },
    enzymeRequest() {
      return this.api.traction.saphyr.enzymes
    },
  },
  async created() {
    this.provider()
  },
  methods: {
    clearSelect() {
      this.selectedEnzymeId = null
    },
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault()

      if (!this.selectedEnzymeId) {
        alert('Please select an enzyme')
      } else {
        this.handleSubmit()
      }
      this.showModal = false
    },
    handleSubmit() {
      this.$emit('selectEnzyme', this.selectedEnzymeId)
      this.clearSelect()
      this.showModal = true
    },
    displayModal() {
      this.showModal = true
    },
    async getEnzymeOptions() {
      const promise = this.enzymeRequest.get()
      const response = await handlePromise(promise)

      if (response.successful) {
        const enzymes = response.deserialize.enzymes
        const enzymeOptions = enzymes.map((enzyme) =>
          Object.assign({ value: parseInt(enzyme.id), text: enzyme.name }),
        )
        enzymeOptions.unshift({ value: null, text: 'Please select an option' })
        this.enzymeOptions = enzymeOptions
      } else {
        this.message = response.errors.message
      }
    },
    async provider() {
      this.getEnzymeOptions()
    },
  },
}
</script>
