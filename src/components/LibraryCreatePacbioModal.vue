<template>
  <div>
    <b-btn id="createLibraryPacbioModal"
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
             scrollable
             >
      <alert ref='alert'></alert>
      
      <b-form id="libraryCreateModal">
        <p>
          The following samples are used to create this library:
          <ul>
            <template v-for="sample in selectedSamples">
              <li :key="sample.id">{{sample.sample_name}} ({{ sample.barcode}})</li>

            </template>
          </ul>
        </p>

        <b-form-group id="tag-select-input"
                          label="Tag:"
                          label-for="tag-input">
          <b-form-select id="tag-input" v-model="library.tag" :options="tagOptions" class="mb-3" />
        </b-form-group>

        <b-form-group id="input-group-1"
                      label="Volume:"
                      label-for="input-1">
          <b-form-input id="input-1"
                        v-model="library.volume"
                        type="number"
                        required
                        placeholder="1.0">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2"
                      label="Concentration:"
                      label-for="input-2">
          <b-form-input id="input-2"
                        v-model="library.concentration"
                        type="number"
                        required
                        placeholder="1.0">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2"
                      label="Library kit barcode:"
                      label-for="input-3">
          <b-form-input id="input-3"
                        v-model="library.libraryKitBarcode"
                        type="text"
                        required
                        placeholder="ABC">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2"
                      label="Fragment size"
                      label-for="input-4">
          <b-form-input id="input-4"
                        v-model="library.fragmentSize"
                        type="number"
                        required
                        placeholder="100">
          </b-form-input>
        </b-form-group>

      </b-form>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancel
        </b-button>

        <b-button variant="success" @click="handleLibraryCreate()">
          Create
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Api from '@/mixins/Api'
import Alert from '@/components/Alert'
import Helper from '@/mixins/Helper'
import * as consts from '@/consts/consts'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LibraryCreatePacbioModal',
  mixins: [Api, Helper],
  data () {
    return {
      library: {},
      tagOptions: []
    }
  },
  components: {
    Alert
  },
  props: {
    disabled: Boolean,
    isStatic: Boolean,
    selectedSamples: Array
  },
  methods: {
    async provider() {
      try {
        await this.setTags()
        this.tagOptions = this.tractionTags.map(tag => tag.oligo)
      } catch (error) {
        this.showAlert("Failed to get tags: " + error.message, 'danger')
      }
    },
    ...mapActions('traction/pacbio/tubes', [
      'createLibrariesInTraction',
      'getTractionTubesForBarcodes',
    ]),
    ...mapActions('traction', [
      'setTags',
    ]),
    async handleLibraryCreate () {
      try {
        await this.createLibraries()
        await this.handleTractionTubes()
      } catch (err) {
        this.showAlert(err, 'danger')
      }
    },
    async createLibraries () {
      this.library.samples = this.selectedSamples
      let payload = { libraries: [this.library] }
      let response = await this.createLibrariesInTraction(payload)

      if (response.successful || !response.empty ) {
        this.barcodes = response.deserialize.libraries.map(l => l.barcode)
      } else {
        throw Error(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + response.errors.message)
      }
    },
    async handleTractionTubes () {
      if (this.barcodes === undefined || !this.barcodes.length) {
        throw Error(consts.MESSAGE_WARNING_NO_BARCODES)
      }

      let response = await this.getTractionTubesForBarcodes(this.barcodes)
      if (response.successful && !response.empty) {
        let tubes = this.tractionTubes
        // Surely all these tubes will be libraries since we are creating libraries?
        if (tubes.every(t => t.material.type === "libraries")) {
          this.redirectToLibraries(tubes)
        }
      } else {
        throw Error(consts.MESSAGE_ERROR_GET_TRACTION_TUBES)
      }
    },
    redirectToLibraries (tubes) {
      this.$router.push({name: 'PacbioLibraries', query: { barcode: tubes.map(tube => tube.barcode) }})
    },
  },
  computed: {
    ...mapGetters('traction/pacbio/tubes', [
      'tractionTubesWithInfo',
      'tractionTubes',
      'requestsRequest',
      'libraryRequest',
      'tractionTags'
    ]),
    ...mapGetters('traction', [
      'tractionTags'
    ])
  },
  created() {
    this.provider()
  },
}
</script>
