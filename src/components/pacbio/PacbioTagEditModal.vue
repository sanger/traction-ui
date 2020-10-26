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
                      :label="'Sample tag: '"
                      label-for="input-1">
          <b-form-select ref="tagSelection" 
                        id="tagSelection" 
                        :value="123"
                        :options=[]>
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
      selectedTagSampleId: ""
    }
  },
  props: {
    // lib: {
    //   type: [Object]
    // }
  },
  methods: {
    async update() {
      try {
        await this.updateLibrary(this.library)
        this.alert('Library updated', 'success')
      } catch (err) {
        this.alert('Failed to update library. ' + err, 'danger')
      }
      this.hide()
    },
    async provider() {
      console.log('hello')
    },
    show() {
      this.$refs['modal'].show()
      this.provider()
    },
    alert (message, type) {
      this.$emit('alert', message, type)
    },
    ...mapActions( 'traction', [
      'setTags'
    ])
  },
  computed :{
    ...mapGetters( 'traction', [
      'tractionTags'
    ])
  }
}

</script>
    