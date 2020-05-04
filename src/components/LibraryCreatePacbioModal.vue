<template>
  <div>
    <b-btn id="createLibraryPacbioModal"
           :disabled="disabled"
           v-b-modal.pacbioLibraryModal
           variant="success">
      Create Library
    </b-btn>
    <b-modal id="pacbioLibraryModal"
             size="lg"
             title="Create Library"
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
          <b-form-select id="tag-input" v-model="library.tag.group_id" :options="tagOptions" class="mb-3" />
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
      library: { tag: {}},
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
        this.tagOptions = this.tractionTags.map(tag => tag.group_id)
      } catch (error) {
        this.showAlert("Failed to get tags: " + error.message, 'danger')
      }
    },
    ...mapActions('traction/pacbio/tubes', [
      // TODO: move this to in pacbio/libraries
      'createLibraryInTraction',
    ]),
    ...mapActions('traction', [
      'setTags',
    ]),
    async handleLibraryCreate () {
      try {
        await this.createLibrary()
        // TODO: redirect to libraries. this.redirectToLibraries()
        // await this.handleTractionTubes()
      } catch (err) {
        this.showAlert(err, 'danger')
      }
    },
    async createLibrary () {
      this.library.samples = this.selectedSamples
      let payload = { library: this.library }
      let response = await this.createLibraryInTraction(payload)

      if (response.successful || !response.empty ) {
        this.barcodes = response.deserialize.libraries.map(l => l.barcode)
      } else {
        throw Error(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + response.errors.message)
      }
    },
    // redirectToLibraries () {
    //   this.$router.push({ name: 'PacbioLibraries' })
    // },
  },
  computed: {
    ...mapGetters('traction/pacbio/tubes', [
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
