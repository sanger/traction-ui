<template>
  <div>
    <b-button :id="'editLibrary-'+this.lib.id" size="sm" @click="show" variant="outline-primary">Edit</b-button>

    <b-modal
      id="editLibraryModal"
      ref="modal"
      title="Edit Library"      
    >    

      <b-form id="editLibraryForm" v-on:submit.prevent>
        <b-form-group id="input-group-1"
                      label="Volume:"
                      label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="library.volume">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2"
                      label="Concentration:"
                      label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="library.concentration">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3"
                      label="Library Kit Barcode:"
                      label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="library.library_kit_barcode">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-4"
                      label="Fragment Size:"
                      label-for="input-4">
          <b-form-input
            id="input-4"
            v-model="library.fragment_size">
          </b-form-input>
        </b-form-group>
      </b-form>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancel
        </b-button>

        <b-button variant="success" @click="update()">
          Update Library
        </b-button>
      </template>

    </b-modal>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
// TODO: move to pacbio libraries
const { mapActions } = createNamespacedHelpers('traction/pacbio/tubes')

export default {
  name: 'PacbioLibraryEditModal',
  data() {
    return {
      library: {
        fragment_size: "",
        library_kit_barcode: "",
        concentration: "",
        volume: ""
      }
    }
  },
  props: {
    lib: {
      type: [Object]
    }
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
    show() {
      this.$refs['modal'].show()
      this.library = this.lib
    },
    hide() {
      this.$refs['modal'].hide()
    },
    alert (message, type) {
      this.$emit('alert', message, type)
    },
    ...mapActions([
      'updateLibrary'
    ])
  }
}

</script>
