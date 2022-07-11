<template>
  <div>
    <traction-button
      :id="'editTag' + request_library.id"
      size="sm"
      variant="outline-primary"
      @click="show"
      >Edit</traction-button
    >

    <traction-modal id="editTagModal" ref="modal" title="Edit Tag">
      <b-form id="editTagForm">
        <b-form-group
          id="input-group-1"
          :label="'Sample tag: ' + request_library.sample_name"
          label-for="input-1"
        >
          <traction-select
            id="tagSelection"
            ref="tagSelection"
            v-model="selectedSampleTagId"
            :options="tags"
          >
          </traction-select>
        </b-form-group>
      </b-form>

      <template #modal-footer="{ cancel }">
        <traction-button @click="cancel()"> Cancel </traction-button>

        <traction-button variant="success" @click="update()"> Update Tag </traction-button>
      </template>
    </traction-modal>
  </div>
</template>

<script>
import ModalHelper from '@/mixins/ModalHelper'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PacbioLibraryTagModal',
  mixins: [ModalHelper],
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    request_library: {
      type: [Object],
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      tags: [],
      selectedSampleTagId: '',
    }
  },
  computed: {
    ...mapGetters('traction', ['tractionTags']),
  },
  methods: {
    async update() {
      let payload = {
        selectedSampleTagId: this.selectedSampleTagId,
        request_library_id: this.request_library.id,
      }
      let response = await this.updateTag(payload)
      if (response.successful) {
        this.alert('Tag updated', 'success')
        this.hide()
        this.$emit('reloadPage')
      } else {
        this.alert('Failed to update Tag', 'danger')
      }
    },
    async provider() {
      try {
        await this.setTags()
        this.tags = this.tractionTags
          .filter((tag) => tag.tag_set_id == 1) // tag_set_id == 1 - pacbio tag set
          .map((tag) => ({ text: tag.group_id, value: tag.id }))
      } catch (error) {
        this.alert('Failed to get tags: ' + error.message, 'danger')
      }
    },
    show() {
      this.$refs['modal'].show()
      this.provider()
      this.selectedSampleTagId = this.request_library.tag_id
    },
    alert(message, type) {
      this.$emit('alert', message, type)
    },
    ...mapActions('traction', ['setTags']),
    ...mapActions('traction/pacbio/libraries', ['updateTag']),
  },
}
</script>
