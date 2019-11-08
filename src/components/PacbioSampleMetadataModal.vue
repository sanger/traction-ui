<template>
  <div>
    <b-button :id="generateId('editRun', this.id)" size="sm" @click="show = true" variant="outline-primary">Edit</b-button>

    <b-modal
      id="editSampleModal"
      v-model="show"
      ref="modal"
      title="Edit Sample"      
    >    

      <b-form id="sampleMetaDataForm">
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

        <b-form-group id="estimateOfGBRequired"
                      label="Estimate of GB required:"
                      label-for="estimateOfGBRequired">
          <b-form-input
            ref="estimateOfGBRequired"
            id="estimateOfGBRequired"
            :value="estimateOfGBRequired"
            @change="updateEstimateOfGBRequired"
            placeholder="Library Type">
          </b-form-input>
        </b-form-group>

        <b-form-group id="numberOfSMRTCells"
                      label="Number of SMRT Cells:"
                      label-for="numberOfSMRTCells">
          <b-form-input
            ref="numberOfSMRTCells"
            id="numberOfSMRTCells"
            :value="numberOfSMRTCells"
            @change="updateNumberOfSMRTCells"
            placeholder="Number of SMRT Cells">
          </b-form-input>
        </b-form-group>

        <b-form-group id="costCode"
                      label="Cost Code:"
                      label-for="costCode">
          <b-form-input
            ref="costCode"
            id="costCode"
            :value="costCode"
            @change="updateCostCode"
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
        this.alert('Failed to update sample. ' + err, 'danger')
      }
      this.hide()
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    updateLibraryType(libraryType) {
      this.setLibraryType({ requestId: this.id, libraryType: libraryType})
    },
    updateEstimateOfGBRequired(estimateOfGBRequired) {
      this.setEstimateOfGBRequired({ requestId: this.id, estimateOfGBRequired: estimateOfGBRequired})
    },
    updateNumberOfSMRTCells(numberOfSMRTCells) {
      this.setNumberOfSMRTCells({ requestId: this.id, numberOfSMRTCells: numberOfSMRTCells})
    },
    updateCostCode(costCode) {
      this.setCostCode({ requestId: this.id, costCode: costCode})
    },
    ...mapActions([
      'updateRequest',
    ]),
    ...mapMutations([
      'setLibraryType',
      'setEstimateOfGBRequired',
      'setNumberOfSMRTCells',
      'setCostCode'
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
      estimateOfGBRequired (state) {
        return state.requests.find(s => s.id === this.id).estimate_of_gb_required
      },
      numberOfSMRTCells (state) {
        return state.requests.find(s => s.id === this.id).number_of_smrt_cells
      },
      costCode (state) {
        return state.requests.find(s => s.id === this.id).cost_code
      }
    })
  },
}

</script>
