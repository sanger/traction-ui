<template>
  <div class="w-3/5 mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4">
    <traction-form @submit="onSubmit">
      <traction-heading level="3" show-border
        >Which QC Results would you like to upload?</traction-heading
      >
      <traction-select
        id="used-by-select-input"
        v-model="usedBySelected"
        class="my-5"
        :options="usedByOptions"
        :state="!!usedBySelected ? true : null"
        required
      ></traction-select>
      <traction-heading level="3" show-border>CSV File</traction-heading>

      <div :class="['w-full', 'my-4', `${border}`]">
        <input
          id="qcResultsUploadFile"
          ref="qcResultsUploadFile"
          class="block w-full rounded border file:border-0"
          type="file"
          accept="text/csv, .csv"
          required
          @change="fileSelected"
        />
      </div>

      <div class="pt-2 space-x-4 pb-4 flex flex-row justify-end">
        <traction-button
          id="upload-button"
          type="submit"
          theme="create"
          size="lg"
          :disabled="disableUpload"
        >
          Upload File
          <UploadIcon class="pl-1" />
          <traction-spinner v-show="busy"></traction-spinner>
        </traction-button>
        <traction-button
          id="reenable-button"
          size="lg"
          :disabled="!disableUpload"
          theme="reset"
          @click="reEnable()"
          >Re-enable</traction-button
        >
      </div>
    </traction-form>
  </div>
</template>

<script>
import { createQcResultsUploadResource } from '@/services/traction/QcResultsUpload'
import UploadIcon from '@/icons/UploadIcon.vue'
import useRootStore from '@/stores'
export default {
  name: 'QcResultsUploadForm',
  components: {
    UploadIcon,
  },
  data() {
    return {
      usedByOptions: [
        { value: null, text: 'Please select a option' },
        { value: 'extraction', text: 'Extraction' },
      ],
      file: null,
      usedBySelected: 'extraction',
      busy: null,
      disableUpload: null,
      uploadSuccessful: null, // possible values: true, false and null
    }
  },
  computed: {
    api() {
      const rootStore = useRootStore()
      return rootStore.api
    },
    qcResultUploadsRequest: ({ api }) => api.traction.qc_results_uploads.create,
    border() {
      // If upload is successful, highlight the input box in green
      // If upload is not successful, highlight the input box in red
      // Otherwise, uploadSuccessful is null and provide no colouring
      if (this.uploadSuccessful === true) {
        return 'rounded border border-success'
      } else if (this.uploadSuccessful === false) {
        return 'rounded border border-failure'
      }
      return 'border-0'
    },
  },
  methods: {
    reEnable() {
      this.$refs.qcResultsUploadFile.value = ''
      this.uploadSuccessful = null
      this.file = null
      this.disableUpload = !this.disableUpload
    },
    async fileSelected(evt) {
      if (evt?.target?.files?.length) {
        this.file = evt.target.files[0]
      } else {
        this.file = null
        return
      }
    },
    async onSubmit() {
      await this.postCSV()
    },
    async postCSV() {
      // We want to keep the button disabled after every upload, unless refreshed or "Re-enable" clicked
      this.busy = true
      this.disableUpload = true

      const csv = await this.file.text()
      const data = { csv: csv, usedBySelected: this.usedBySelected }
      const { success, errors } = await createQcResultsUploadResource(
        this.qcResultUploadsRequest,
        data,
      )
      this.uploadSuccessful = success

      if (success) {
        this.showAlert(`Successfully imported: ${this.file.name}`, 'success')
      } else {
        this.showAlert(errors || 'Unable to upload QC File', 'danger')
      }
      this.busy = false
    },
  },
}
</script>
