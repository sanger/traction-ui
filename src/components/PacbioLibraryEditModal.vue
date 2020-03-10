<template>
  <div>
    <b-button :id="generateId('editLibrary', this.lib.id)" size="sm" @click="show" variant="outline-primary">Edit</b-button>

    <b-modal
      id="editLibraryModal"
      ref="modal"
      title="Edit Library"      
    >    

      <b-form id="editLibraryForm">
        <b-form-group id="volume"
                      label="Volume:"
                      label-for="volume">
          <b-form-input
            ref="volume"
            id="volume"
            v-model="library.volume">
          </b-form-input>
        </b-form-group>

        <b-form-group id="concentration"
                      label="Concentration:"
                      label-for="concentration">
          <b-form-input
            ref="concentration"
            id="concentration"
            v-model="library.concentration">
          </b-form-input>
        </b-form-group>

        <b-form-group id="libraryKitBarcode"
                      label="Library Kit Barcode:"
                      label-for="libraryKitBarcode">
          <b-form-input
            ref="libraryKitBarcode"
            id="libraryKitBarcode"
            v-model="library.library_kit_barcode">
          </b-form-input>
        </b-form-group>

        <b-form-group id="fragmentSize"
                      label="Fragment Size:"
                      label-for="fragmentSize">
          <b-form-input
            ref="fragmentSize"
            id="fragmentSize"
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
    generateId(text, id) {
      return `${text}-${id}`
    },
    show() {
      this.$refs['modal'].show()
    },
    hide() {
      this.$refs['modal'].hide()
    },
    alert (message, type) {
      this.$emit('alert', message, type)
    },
    ...mapActions([
      'updateLibrary',
    ])
  },
  created() {
    this.library = this.lib
  }
}

</script>
