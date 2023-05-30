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

      <!-- Will be removed -->
      <!-- <traction-file
        id="qc-results-upload-file"
        v-model="file"
        class="my-5 text-left"
        :state="!!file ? true : null"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here (CSV only)..."
        accept="text/csv, .csv"
        required
      ></traction-file> -->
      <!--  -->

      <div :class="['w-full', `${border}`]">
        <input
          id="qcResultsUploadFile"
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
          @click="disableUpload = !disableUpload"
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
    border() {
      if (this.file === null) return 'border-0'
      else {
        return 'rounded border border-green-500'
      }
    },
  },
  methods: {
    async fileSelected(evt) {
      if (evt === null || evt.target.files === null || evt.target.files.length == 0) {
        this.file = null
        return
      } else {
        this.file = true
      }
    },
    async onSubmit() {
      await this.postCSV()
    },
    async postCSV() {
      // We want to keep the button disabled after every upload, unless refreshed or "Re-enable" clicked
      this.busy = true
      this.disableUpload = true

      const fileInput = document.getElementById('qcResultsUploadFile')
      const uploadedFile = fileInput.files[0]
      const reader = new FileReader()

      reader.onload = async (res) => {
        const csv = res.target.result
        try {
          const data = { csv: csv, usedBySelected: this.usedBySelected }
          await createQcResultsUploadResource(this.qcResultUploadsRequest, data)
          this.showAlert(`Successfully imported: ${fileInput.files[0].name}`, 'success')
        } catch (e) {
          this.showAlert(e, 'danger')
        }
      }
      reader.readAsText(uploadedFile)
      this.busy = false
    },
  },
}
</script>
