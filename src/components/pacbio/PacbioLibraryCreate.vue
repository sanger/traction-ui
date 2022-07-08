<template>
  <div>
    <traction-button
      id="pacbioLibraryCreate"
      v-b-modal.pacbioLibraryModal
      :disabled="disabled"
      variant="success"
      @click="show"
    >
      Create Library
    </traction-button>
    <traction-modal
      id="pacbioLibraryModal"
      ref="modal"
      size="lg"
      title="Create Library"
      :static="isStatic"
      scrollable
    >
      <b-form id="libraryCreateModal" @submit.prevent="createLibrary">
        <b-form-group id="selected-sample" label="The sample selected for this library is:">
          {{ selectedSample.sample_name }} ({{ selectedSample.source_identifier }})
        </b-form-group>

        <b-form-group id="tag-select-input" label="Tag:" label-for="tag-input">
          <b-form-select
            id="tag-input"
            v-model="library.tag.group_id"
            :options="tagOptions"
            class="mb-3"
          />
        </b-form-group>

        <b-form-group id="input-group-volume" label="Volume:" label-for="library-volume">
          <b-form-input
            id="library-volume"
            v-model="library.volume"
            type="number"
            min="0"
            step="any"
            placeholder="Example: 1.0"
          >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-concentration"
          label="Concentration:"
          label-for="library-concentration"
        >
          <b-form-input
            id="library-concentration"
            v-model="library.concentration"
            type="number"
            min="0"
            step="any"
            placeholder="Example: 1.0"
          >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-templatePrepKitBoxBarcode"
          label="Template prep kit box barcode:"
          label-for="library-templatePrepKitBoxBarcode"
        >
          <b-form-input
            id="library-templatePrepKitBoxBarcode"
            v-model="library.template_prep_kit_box_barcode"
            type="text"
            minlength="21"
            maxlength="21"
            placeholder="Example: 012345678901234567890"
            pattern="\d*"
            inputmode="numeric"
          >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-insertSize"
          label="Insert size"
          label-for="library-insertSize"
        >
          <b-form-input
            id="library-insertSize"
            v-model="library.insert_size"
            type="number"
            step="1"
            min="0"
            placeholder="Example: 100"
          >
          </b-form-input>
        </b-form-group>
      </b-form>

      <template #modal-footer="{ cancel }">
        <traction-button @click="cancel()"> Cancel </traction-button>

        <traction-button id="create-btn" variant="success" type="submit" form="libraryCreateModal">
          Create
        </traction-button>
      </template>
    </traction-modal>
  </div>
</template>

<script>
import Api from '@/mixins/Api'
import ModalHelper from '@/mixins/ModalHelper'
import * as consts from '@/consts/consts'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PacbioLibraryCreate',
  mixins: [Api, ModalHelper],
  props: {
    disabled: Boolean,
    isStatic: Boolean,
    selectedSample: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      library: { tag: { group_id: '' }, sample: {} },
      tagOptions: [{ value: '', text: 'No tag' }],
    }
  },
  computed: {
    ...mapGetters('traction', ['tractionTags']),
  },
  created() {
    this.provider()
  },
  methods: {
    async provider() {
      try {
        await this.setTags()
        this.tractionTags.forEach((tag) => this.tagOptions.push(tag.group_id))
      } catch (error) {
        this.showAlert(consts.MESSAGE_ERROR_FIND_TAGS_FAILED + error.message, 'danger')
      }
    },
    async createLibrary() {
      const { success, barcode, errors } = await this.createLibraryInTraction(this.library)
      if (success) {
        this.hide()
        this.$emit('alert', 'Created library with barcode ' + barcode, 'success')
      } else {
        this.showAlert(consts.MESSAGE_ERROR_CREATE_LIBRARY_FAILED + errors, 'danger')
      }
    },
    show() {
      this.library = { tag: { group_id: '' }, sample: this.selectedSample }
    },
    ...mapActions('traction/pacbio/libraries', ['createLibraryInTraction']),
    ...mapActions('traction', ['setTags']),
  },
}
</script>
