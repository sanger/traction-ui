<template>
  <div>
    <traction-form class="text-left" @submit="onSubmit">
      <traction-sub-section title="Which QC Results would you like to upload?" class="py-6">
        <traction-select
          v-model="usedBySelected"
          :options="usedByOptions"
          :state="!!usedBySelected ? true : null"
          required
        ></traction-select>
      </traction-sub-section>
      <traction-sub-section title="CSV File" class="py-6">
        <traction-file
          v-model="file"
          :state="!!file ? true : null"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here (CSV only)..."
          accept="text/csv, .csv"
          required
        ></traction-file>
      </traction-sub-section>
      <traction-button id="upload-button" type="submit" theme="create" size="lg" :disabled="busy">
        <!-- Weird bug - spinner won't show unless button text is two words/ big enough? -->
        Upload File
        <traction-spinner v-show="busy"></traction-spinner>
      </traction-button>
    </traction-form>
  </div>
</template>

<script>
import Api from '@/mixins/Api'
import { createQcResultsUploadResource } from '@/services/traction/QcResultsUpload'

export default {
  name: 'ExtractionQcForm',
  mixins: [Api],
  data() {
    return {
      usedByOptions: [
        { value: null, text: 'Please select a option' },
        { value: 'extraction', text: 'Extraction' },
      ],
      file: null,
      usedBySelected: null,
      busy: null,
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
      this.busy = true
      try {
        const csv = await this.file.text()
        let data = { csv: csv, usedBySelected: this.usedBySelected }
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
