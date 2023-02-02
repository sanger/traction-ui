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
      scrollable
    >
      <traction-form id="libraryCreateModal" @submit.prevent="createLibrary" @keydown.enter.prevent>
        <traction-form-group id="selected-sample" label="The sample selected for this library is:">
          {{ selectedSample.sample_name }} ({{ selectedSample.source_identifier }})
        </traction-form-group>

        <traction-form-group id="tag-set-select-input" label-for="tag-set-input" label="Tag:">
          <traction-select
            id="tag-set-input"
            v-model="selectedTagSetId"
            data-type="tag-set-list"
            :options="tagSetOptions"
            @input="resetSelectedTagId"
          ></traction-select>
        </traction-form-group>

        <traction-form-group id="tag-select-input" label-for="tag-input">
          <traction-select
            id="tag-input"
            v-model="selectedTagId"
            :options="tagOptions"
            class="mb-3"
          />
        </traction-form-group>

        <traction-form-group id="input-group-volume" label="Volume:" label-for="library-volume">
          <traction-input
            id="library-volume"
            v-model="library.volume"
            type="number"
            min="0"
            step="any"
            placeholder="Example: 1.0"
          >
          </traction-input>
        </traction-form-group>

        <traction-form-group
          id="input-group-concentration"
          label="Concentration:"
          label-for="library-concentration"
        >
          <traction-input
            id="library-concentration"
            v-model="library.concentration"
            type="number"
            min="0"
            step="any"
            placeholder="Example: 1.0"
          >
          </traction-input>
        </traction-form-group>

        <traction-form-group
          id="input-group-templatePrepKitBoxBarcode"
          label="Template prep kit box barcode:"
          label-for="library-templatePrepKitBoxBarcode"
        >
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
        </traction-form-group>

        <traction-form-group
          id="input-group-insertSize"
          label="Insert size"
          label-for="library-insertSize"
        >
          <traction-input
            id="library-insertSize"
            v-model="library.insert_size"
            type="number"
            step="1"
            min="0"
            placeholder="Example: 100"
          >
          </traction-input>
        </traction-form-group>
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
import { mapActions, mapState } from 'vuex'

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
      library: { tag: {}, sample: {} },
      selectedTagSetId: '',
      selectedTagId: '',
    }
  },
  computed: {
    // Map fetched Pacbio tag sets and tags
    ...mapState('traction/pacbio/poolCreate', {
      tagSets: (state) => state.resources.tagSets,
      tags: (state) => state.resources.tags,
    }),
    // Return options for the first dropdown
    tagSetOptions() {
      const tagSets = Object.values(this.tagSets)
      const options = tagSets.map(({ id: value, name: text }) => ({ value, text }))
      const placeholder = { value: '', text: 'Please select a tag set' }
      return [placeholder, ...options]
    },
    // Return options for the second dropdown
    tagOptions() {
      const placeholder = { value: '', text: 'Please select a tag' }
      if (this.selectedTagSetId) {
        const tagSet = this.tagSets[this.selectedTagSetId]
        const tags = tagSet.tags.map((id) => this.tags[id])
        const options = tags.map(({ id: value, group_id: text }) => ({ value, text }))
        return [placeholder, ...options]
      } else {
        return [placeholder]
      }
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
      this.selectedTagId = ''
    },
    async createLibrary() {
      if (this.selectedTagId) {
        this.library.tag = this.tags[this.selectedTagId]
      }
      const { success, barcode, errors } = await this.createLibraryInTraction(this.library)
      if (success) {
        this.hide()
        this.$emit('alert', 'Created library with barcode ' + barcode, 'success')
      } else {
        this.showAlert('Failed to create library in Traction: ' + errors, 'danger')
      }
    },
    show() {
      this.library = { tag: { group_id: '' }, sample: this.selectedSample }
    },
    ...mapActions('traction/pacbio/libraries', ['createLibraryInTraction']),
    // Map action to fetch Pacbio tag-sets and tags
    ...mapActions('traction/pacbio/poolCreate', ['fetchPacbioTagSets']),
  },
}
</script>
