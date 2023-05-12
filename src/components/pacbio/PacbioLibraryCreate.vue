<template>
  <div>
    <traction-button
      id="pacbioLibraryCreate"
      v-traction-modal.pacbioLibraryModal
      :disabled="disabled"
      theme="create"
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
      :visible="showModal"
      scrollable
      @cancel="hide"
    >
      <traction-form id="libraryCreateModal" @submit="createLibrary" @keydown.enter.prevent>
        <fieldset id="selected-sample" class="py-1">
          <label>The sample selected for this library is:</label>
          <br />
          {{ selectedSample.sample_name }} ({{ selectedSample.source_identifier }})
        </fieldset>

        <fieldset id="tag-set-select-input" class="py-2">
          <label>Tag:</label>
          <traction-select
            id="tag-set-input"
            v-model="selectedTagSetId"
            data-type="tag-set-list"
            :options="tagSetOptions"
            class="mb-3"
            @input="resetSelectedTagId"
          ></traction-select>

          <traction-select
            id="tag-input"
            v-model="library.tag.id"
            :options="tagOptions"
            :disabled="!selectedTagSetId"
            class="mb-3"
          />
        </fieldset>

        <fieldset id="input-group-volume" class="py-2">
          <label>Volume:</label>
          <traction-input
            id="library-volume"
            v-model="library.volume"
            type="number"
            min="0"
            step="any"
            placeholder="Example: 1.0"
          >
          </traction-input>
        </fieldset>

        <fieldset id="input-group-concentration" class="py-2">
          <label>Concentration:</label>

          <traction-input
            id="library-concentration"
            v-model="library.concentration"
            type="number"
            min="0"
            step="any"
            placeholder="Example: 1.0"
          >
          </traction-input>
        </fieldset>

        <fieldset id="input-group-templatePrepKitBoxBarcode" class="py-2">
          <label>Template prep kit box barcode:</label>
          <traction-input
            id="library-templatePrepKitBoxBarcode"
            v-model="library.template_prep_kit_box_barcode"
            type="text"
            minlength="21"
            maxlength="21"
            placeholder="Example: 012345678901234567890"
            pattern="\d*"
            inputmode="numeric"
          >
          </traction-input>
        </fieldset>

        <fieldset id="input-group-insertSize" class="py-2">
          <label>Insert size:</label>
          <traction-input
            id="library-insertSize"
            v-model="library.insert_size"
            type="number"
            step="1"
            min="0"
            placeholder="Example: 100"
          >
          </traction-input>
        </fieldset>
      </traction-form>

      <template #modal-footer="{ cancel }">
        <traction-button @click="cancel()"> Cancel </traction-button>

        <traction-button id="create-btn" theme="create" type="submit" form="libraryCreateModal">
          Create
        </traction-button>
      </template>
    </traction-modal>
  </div>
</template>

<script>
import Api from '@/mixins/Api'
import ModalHelper from '@/mixins/ModalHelper'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('traction/pacbio/libraries')

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
      library: { tag: { id: '' }, sample: {} },
      selectedTagSetId: '',
      showModal: false,
    }
  },
  computed: {
    ...mapGetters(['tagSetChoices', 'tagChoices']),

    // Return options for the first dropdown
    tagSetOptions() {
      const placeholder = { value: '', text: 'Please select a tag set' }
      return [placeholder, ...this.tagSetChoices]
    },
    // Return options for the second dropdown
    tagOptions() {
      const placeholder = { value: '', text: 'Please select a tag' }
      return [placeholder, ...this.tagChoices(this.selectedTagSetId)]
    },
  },
  created() {
    this.provider()
  },
  methods: {
    // Fetch Pacbio tag-sets and tags
    async provider() {
      try {
        await this.fetchPacbioTagSets()
      } catch (error) {
        this.showAlert('Failed to find tags in Traction' + error.message, 'danger')
      }
    },
    // Reset the selected tag id if tag-set is changed
    resetSelectedTagId() {
      this.library.tag.id = ''
    },
    async createLibrary() {
      const { success, barcode, errors } = await this.createLibraryInTraction(this.library)
      if (success) {
        this.hide()

        /**This need to be removed when custom_enable_modal feature flag is removed */
        if ('b-modal' in this.$refs['modal'].$refs) {
          this.$refs['modal'].$refs['b-modal'].hide()
        }

        this.$emit('alert', 'Created library with barcode ' + barcode, 'success')
      } else {
        this.showAlert('Failed to create library in Traction: ' + errors, 'danger')
      }
    },
    show() {
      this.library = { tag: { id: '' }, sample: this.selectedSample }
      this.showModal = true
      this.selectedTagSetId = ''
    },
    hide() {
      this.showModal = false
    },
    ...mapActions(['fetchPacbioTagSets', 'createLibraryInTraction']),
  },
}
</script>
