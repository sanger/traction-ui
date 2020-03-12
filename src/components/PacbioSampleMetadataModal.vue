<template>
  <div>
    <b-button :id="generateId('editSample', request.id)" size="sm" @click="show" variant="outline-primary">Edit</b-button>

    <b-modal
      id="editSampleModal"
      ref="modal"
      title="Edit Sample"      
    >    

      <b-form id="sampleMetaDataForm">
        <b-form-group id="libraryType"
                      label="Library Type:"
                      label-for="libraryType">
          <b-form-input
            id="libraryType"
            v-model="request.library_type"
            placeholder="Library Type">
          </b-form-input>
        </b-form-group>

        <b-form-group id="estimateOfGBRequired"
                      label="Estimate of GB required:"
                      label-for="estimateOfGBRequired">
          <b-form-input
            id="estimateOfGBRequired"
            v-model="request.estimate_of_gb_required"
            placeholder="Estimate of GB required">
          </b-form-input>
        </b-form-group>

        <b-form-group id="numberOfSMRTCells"
                      label="Number of SMRT Cells:"
                      label-for="numberOfSMRTCells">
          <b-form-input
            id="numberOfSMRTCells"
            v-model="request.number_of_smrt_cells"
            placeholder="Number of SMRT Cells">
          </b-form-input>
        </b-form-group>

        <b-form-group id="costCode"
                      label="Cost Code:"
                      label-for="costCode">
          <b-form-input
            id="costCode"
            v-model="request.cost_code"
            placeholder="Cost Code">
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
const { mapActions} = createNamespacedHelpers('traction/pacbio/requests')

export default {
  name: 'PacbioSampleMetadataModal',
  data () {
    return {
      request: {
        library_type: "",
        estimate_of_gb_required: "",
        number_of_smrt_cells: "",
        cost_code: ""
      }
    }
  },
  props: {
    req: {
      type: [Object]
    }
  },
  methods: {
    async update() {
      try {
        await this.updateRequest(this.request)
        this.alert('Sample updated', 'success')
      } catch (err) {
        this.alert('Failed to update sample. ' + err, 'danger')
      }
      this.hide()
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    ...mapActions([
      'updateRequest',
    ]),
    hide() {
      this.$refs['modal'].hide()
    },
    show() {
      this.$refs['modal'].show()
    },
    alert (message, type) {
      this.$emit('alert', message, type)
    },
  },
  created() {
    this.request = this.req
  }
}

</script>
