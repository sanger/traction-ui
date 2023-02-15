<template>
  <div class="w-3/5 mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4">
    <traction-form @submit="onSubmit">
      <traction-heading level="3" show-border
        >Which QC Results would you like to upload?</traction-heading
      >
      <traction-select
        class="my-5"
        id="used-by-select-input"
        v-model="usedBySelected"
        :options="usedByOptions"
        :state="!!usedBySelected ? true : null"
        required
      ></traction-select>
      <traction-heading level="3" show-border>CSV File</traction-heading>
      <traction-file
        class="my-5 text-left"
        id="qc-results-upload-file"
        v-model="file"
        :state="!!file ? true : null"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here (CSV only)..."
        accept="text/csv, .csv"
        required
      ></traction-file>
      <div class="space-x-4 pb-4 flex flex-row justify-end">
        <traction-button
          id="upload-button"
          type="submit"
          theme="create"
          size="lg"
          :disabled="disableUpload"
        >
          <!-- Weird bug - spinner won't show unless button text is two words/ big enough? -->
          Upload File
          <UploadIcon class="pl-1" />
          <traction-spinner v-show="busy"></traction-spinner>
        </traction-button>
        <traction-button
          id="reenable-button"
          size="lg"
          :disabled="!disableUpload"
          @click="disableUpload = !disableUpload"
          theme="reset"
          >Re-enable</traction-button
        >
      </div>
    </traction-form>
  </div>
</template>

<script>
import Api from '@/mixins/Api'
import { createQcResultsUploadResource } from '@/services/traction/QcResultsUpload'
import UploadIcon from '@/icons/UploadIcon.vue'

export default {
  name: 'QcResultsUploadForm',
  components: {
    UploadIcon,
  },
  mixins: [Api],
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
    }
  },
  computed: {
    qcResultUploadsRequest: ({ api }) => api.traction.qc_results_uploads.create,
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      await this.postCSV()
    },
    async postCSV() {
      // We want to keep the button disabled after every upload, unless refreshed or "Re-enable" clicked
      this.busy = true
      this.disableUpload = true
      try {
        const csv = await this.file.text()
        const data = { csv: csv, usedBySelected: this.usedBySelected }
        await createQcResultsUploadResource(this.qcResultUploadsRequest, data)

        this.showAlert(`Successfully imported: ${this.file.name}`, 'success')
      } catch (e) {
        this.showAlert(e, 'danger')
      }
      this.busy = false
    },
  },
}
</script>
