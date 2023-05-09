<template>
  <div>
    <traction-button
      id="createLibrariesWithEnzymeButton"
      v-traction-modal.enzymeModal
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
      :static="isStatic"
      @ok="handleOk"
      @shown="clearSelect"
    >
      <traction-select v-model="selectedEnzymeId" :options="enzymeOptions" class="mb-3" />
    </traction-modal>
  </div>
</template>

<script>
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'

export default {
  name: 'SaphyrEnzymeModal',
  mixins: [Api],
  props: {
    disabled: Boolean,
    isStatic: Boolean,
  },
  data() {
    return {
      selectedEnzymeId: null,
      enzymeOptions: [],
      showModal: false,
    }
  },
  computed: {
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
      this.displayModal = false
    },
    handleSubmit() {
      this.$emit('selectEnzyme', this.selectedEnzymeId)
      this.clearSelect()
      this.displayModal = true
      /**
       * Hide the modal manually
       * https://vuejsdevelopers.com/2019/01/22/vue-what-is-next-tick/
       * https://bootstrap-vue.js.org/docs/components/modal/#prevent-closing
       */

      /**This need to be removed when custom_enable_modal feature flag is removed */
      this.$nextTick(() => {
        if ('b-modal' in this.$refs['enzymeModal'].$refs) {
          this.$refs['enzymeModal'].$refs['b-modal'].show()
        }
      })
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
