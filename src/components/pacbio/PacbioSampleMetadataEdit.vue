<template>
  <div>
    <traction-button :id="generateId('editSample', req.id)" size="sm" theme="edit" @click="show"
      >Edit</traction-button
    >

    <traction-modal id="editSampleModal" ref="modal" title="Edit Sample">
      <traction-form id="sampleMetaDataForm">
        <LibraryTypeSelect
          v-model="request.library_type"
          pipeline="pacbio"
          :import="false"
          :label-cols="null"
        />

        <traction-form-group
          id="estimateOfGBRequired"
          label="Estimate of GB required:"
          label-for="estimateOfGBRequired"
        >
          <traction-input
            id="estimateOfGBRequired"
            v-model="request.estimate_of_gb_required"
            placeholder="Estimate of GB required"
          >
          </traction-input>
        </traction-form-group>

        <traction-form-group
          id="numberOfSMRTCells"
          label="Number of SMRT Cells:"
          label-for="numberOfSMRTCells"
        >
          <traction-input
            id="numberOfSMRTCells"
            v-model="request.number_of_smrt_cells"
            placeholder="Number of SMRT Cells"
          >
          </traction-input>
        </traction-form-group>

        <traction-form-group id="costCode" label="Cost Code:" label-for="costCode">
          <traction-input id="costCode" v-model="request.cost_code" placeholder="Cost Code">
          </traction-input>
        </traction-form-group>
      </traction-form>

      <template #modal-footer="{ cancel }">
        <traction-button @click="cancel()"> Cancel </traction-button>

        <traction-button theme="update" @click="update()"> Update Sample </traction-button>
      </template>
    </traction-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import ModalHelper from '@/mixins/ModalHelper'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
const { mapActions } = createNamespacedHelpers('traction/pacbio/requests')

export default {
  name: 'PacbioSampleMetadataEdit',
  components: {
    LibraryTypeSelect,
  },
  mixins: [ModalHelper],
  props: {
    req: {
      type: [Object],
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      request: {
        library_type: '',
        estimate_of_gb_required: '',
        number_of_smrt_cells: '',
        cost_code: '',
      },
    }
  },
  methods: {
    async update() {
      await this.updateRequest(this.request).then(({ success, errors }) => {
        success
          ? this.alert('Sample updated', 'success')
          : this.alert('Failed to update sample. ' + errors, 'danger')
      })
      this.hide()
    },
    generateId(text, id) {
      return `${text}-${id}`
    },
    ...mapActions(['updateRequest']),
    show() {
      this.$refs['modal'].show()
      this.request = { ...this.req }
    },
    alert(message, type) {
      this.$emit('alert', message, type)
    },
  },
}
</script>
