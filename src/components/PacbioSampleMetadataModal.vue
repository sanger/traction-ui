<template>
  <div>
    <b-button :id="generateId('editRun', this.id)" size="sm" @click="show = true" variant="outline-primary">Edit</b-button>

    <b-modal
      id="editSampleModal"
      v-model="show"
      ref="modal"
      title="Edit Sample"      
    >    

      <b-form>
        <b-form-group id="libraryType"
                      label="Library Type:"
                      label-for="libraryType">
          <b-form-input
            ref="libraryType"
            id="libraryType"
            :value="libraryType"
            @change="updateLibraryType"
            placeholder="Library Type">
          </b-form-input>
        </b-form-group>
      </b-form>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancel
        </b-button>

        <b-button variant="success" @click="update()">
          Update Sample
        </b-button>
      </template>

    </b-modal>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters} = createNamespacedHelpers('traction/pacbio/requests')

export default {
  name: 'PacbioSampleMetadataModal',
  data () {
    return {
      show: false
    }
  },
  props: {
    id: {
      type: [String, Number]
    }
  },
  methods: {
    async update() {
      try {
        await this.updateRequest(this.id)
        this.alert('Sample updated', 'success')
      } catch (err) {
        this.alert('Failed to update sample', 'danger')
      }
      this.hide()
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    updateLibraryType(libraryType) {
      this.setLibraryType({ requestId: this.id, libraryType: libraryType})
    },
    ...mapActions([
      'updateRequest',
    ]),
    ...mapMutations([
      'setLibraryType',
    ]),
    hide() {
      this.$refs['modal'].hide()
    },
    alert (message, type) {
      this.$emit('alert', message, type)
    },
  },
  computed: {
    ...mapGetters([
        'requests'
    ]),
    ...mapState({
      libraryType (state) {
        return state.requests.find(s => s.id === this.id).library_type
      },
    })
  },
}

</script>
