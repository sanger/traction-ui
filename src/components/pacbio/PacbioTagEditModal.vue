<template>
  <div>
    <b-button :id="'editTag'" size="sm" @click="show" variant="outline-primary">Edit</b-button>

    <b-modal
      id="editTagModal"
      ref="modal"
      title="Edit Tag"      
    >    

      <b-form id="editTagForm" v-on:submit.prevent>
        <b-form-group id="input-group-1"
                      label="Sample tag: "
                      label-for="input-1">
                      <span>{{ this.tag.sample_name }}</span>
          <b-form-select ref="tagSelection" 
                        id="tagSelection" 
                        v-model="selectedSampleTagId"
                        :options="tags">
          </b-form-select>
        </b-form-group>
      </b-form>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancel
        </b-button>

        <b-button variant="success" @click="update()">
          Update Tag
        </b-button>
      </template>

    </b-modal>
  </div>
</template>

<script>

import ModalHelper from '@/mixins/ModalHelper'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PacbioLibraryTagModal',
  mixins: [ModalHelper],
  data() {
    return {
      tags: [],
      selectedSampleTagId: ""
    }
  },
  props: {
    tag: {
      type: [Object]
    }
  },
  methods: {
    async update() {
      try {
        let payload = {selectedSampleTagId: this.selectedSampleTagId, request_library_id: this.tag.id }
        await this.updateTag(payload)
        this.alert('Tag updated', 'success')
      } catch (err) {
        this.alert('Failed to update tag. ' + err, 'danger')
      }
      this.hide()
    },
    async provider() {
      try{
        await this.setTags()
        this.tags = this.tractionTags
          .filter(tag => tag.tag_set_id == 1)
          .map(tag => ({ text: tag.group_id, value: tag.id }))
      } catch (error) {
        this.alert("Failed to get tags: " + error.message, 'danger')
      }
    },
    show() {
      this.$refs['modal'].show()
      this.provider()
      this.selectedSampleTagId = this.tag.tag_id
    },
    alert (message, type) {
      this.$emit('alert', message, type)
    },
    ...mapActions('traction', [
      'setTags'
    ]),
    ...mapActions('traction/pacbio/libraries', [
      'updateTag'
    ])
  },
  computed :{
    ...mapGetters( 'traction', [
      'tractionTags'
    ])
  }
}

</script>
    