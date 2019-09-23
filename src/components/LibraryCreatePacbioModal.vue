<template>
  <div>
    <b-btn id="create"
           :disabled="disabled"
           v-b-modal.pacbioLibraryModal
           variant="success">
      Create Libraries
    </b-btn>
    <b-modal id="pacbioLibraryModal"
             size="lg"
             title="Create Libraries"
             ref="pacbioLibraryModal"
             :static="isStatic"
             @ok="handleOk"
             @shown="clearSelect">
      <!-- <b-form-select v-model="selectedEnzymeId" :options="enzymeOptions" class="mb-3" /> -->
      <b-form  >
        <b-form-group id="input-group-1"
                      label="Volume:"
                      label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="library_form.volume"
            type="number"
            required
            placeholder="1.0"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2"
                      label="Concentration:"
                      label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="library_form.concentration"
            type="number"
            required
            placeholder="1.0"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2"
                      label="Library kit barcode:"
                      label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="library_form.library_kit_barcode"
            type="text"
            required
            placeholder="ABC"
          ></b-form-input>
        </b-form-group>

      </b-form>
      <template v-slot:modal-footer="{ ok, cancel }">
        <!-- <b>Custom Footer</b> -->
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button @click="cancel()">
          Cancel
        </b-button>
        <b-button variant="success" @click="handleCreate()">
          Create
        </b-button>

        <!-- Button with custom close trigger value -->
        <!-- <b-button size="sm" variant="outline-secondary" @click="hide('forget')">
          Forget it
        </b-button> -->
      </template>
    </b-modal>
  </div>
</template>

<script>
import handlePromise from '@/api/PromiseHelper'
import Api from '@/mixins/Api'

export default {
  name: 'LibraryCreatePacbioModal',
  mixins: [Api],
  data () {
    return {
      // selectedEnzymeId: null,
      // enzymeOptions: []
      library_form: {
          volume: '',
          concentration: '',
          library_kit_barcode: '',
          fragment_size: ''
      },
    }
  },
  props: {
    disabled: Boolean,
    isStatic: Boolean
  },
  methods: {
    // clearSelect () {
    //   this.selectedEnzymeId = null
    // },
    handleCreate (evt) {
      // Prevent modal from closing
      evt.preventDefault()

      // if (!this.selectedEnzymeId) {
      //   alert('Please select an enzyme')
      // } else {
      //   this.handleSubmit()
      // }
    },
    // handleSubmit () {
      // this.$emit('selectEnzyme', this.selectedEnzymeId)
      // this.clearSelect()
      /**
       * Hide the modal manually
       * https://vuejsdevelopers.com/2019/01/22/vue-what-is-next-tick/
       * https://bootstrap-vue.js.org/docs/components/modal/#prevent-closing
       */
    //   this.$nextTick(() => {
    //     this.$refs.pacbioLibraryModal.hide()
    //   })
    // },
    // async getEnzymeOptions () {
    //   let promise = this.enzymeRequest.get()
    //   let response = await handlePromise(promise)

    //   if (response.successful) {
    //     let enzymes = response.deserialize.enzymes
    //     let enzymeOptions = enzymes.map(
    //       (enzyme) => Object.assign({ value: parseInt(enzyme.id), text: enzyme.name }))
    //     enzymeOptions.unshift({ value: null, text: "Please select an option" })
    //     this.enzymeOptions = enzymeOptions
    //   } else {
    //     this.message = response.errors.message
    //   }
    // },
    // async provider () {
    //   this.getEnzymeOptions()
    // }
  },
  // async created() {
  //   this.provider()
  // },
  computed: {
    // enzymeRequest () {
    //   return this.api.traction.saphyr.enzymes
    // }
  }
}
</script>
