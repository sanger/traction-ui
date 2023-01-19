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

        <traction-form-group id="tag-select-input" label="Tag:" label-for="tag-input">
          <traction-select
            id="tag-input"
            v-model="library.tag.group_id"
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
import { mapActions, mapGetters, mapState } from 'vuex'

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
    ...mapState('traction/pacbio/poolCreate', {
      tagSets: (state) => state.resources.tagSets, // reuse indexed tagsets
      tags: (state) => state.resources.tags, // reuse indexed tags
    }),
  },
  created() {
    this.provider()
  },
  methods: {
    async provider() {
      try {
        await this.fetchPacbioTagSets() // Fetch pacbio tagSet and Tag resources
        this.pushTagOptions() // Update tagOptions for select component
      } catch (error) {
        this.showAlert('Failed to find tags in Traction' + error.message, 'danger')
      }
    },
    pushTagOptions() {
      // Options for TractionSelect component.
      Object.values(this.tagSets).forEach((tagSet) => {
        const options = tagSet.tags.map((id) => this.tags[id].group_id)
        const obj = { label: '--- ' + tagSet.name + ' ---', options: options }
        this.tagOptions.push(obj)
      })
    },
    async createLibrary() {
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
    ...mapActions('traction/pacbio/poolCreate', ['fetchPacbioTagSets']), // reuse fetch action
  },
}
</script>
