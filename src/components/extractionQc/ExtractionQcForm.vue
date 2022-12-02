<template>
  <div>
    <traction-form class="text-left" @submit="onSubmit">
      <traction-sub-section title="Which QC Results would you like to upload?" class="py-6">
        <traction-select
          v-model="used_by_selected"
          :options="used_by_options"
          :state="Boolean(used_by_selected)? true : null"
          required
        ></traction-select>
      </traction-sub-section>
      <traction-sub-section title="CSV File" class="py-6">
        <traction-file
          v-model="file"
          :state="Boolean(file)? true : null"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here (CSV only)..."
          accept="text/csv, .csv"
          required
        ></traction-file>
      </traction-sub-section>
      <traction-button id="upload-button" type="submit" theme="create" size="lg">
        <!-- Weird bug that spinner won't show unless button text is two words/ big enough? -->
        Upload File
        <traction-spinner v-show="this.busy"></traction-spinner>
      </traction-button>
    </traction-form>
  </div>
</template>

<script>
import { parse } from 'csv-parse/browser/esm/sync'

export default {
  name: 'ExtractionQcForm',
  data() {
    return {
      // Call API or pull out to config?
      used_by_options: [
        { value: null, text: 'Please select a option' },
        { value: 'extraction', text: 'Extraction' }
      ],
      file: null,
      used_by_selected: null,
      busy: null
    }
  },
  created() {},
  methods: {
    async onSubmit() {
      console.log("Submit!")
      // this.busy = true
      // const csv = await this.file.text()
      // const used_by = this.used_by_selected
      // call API
      // this.busy = false
      // this.showAlert("Uploading file!", 'success')
    }
  },
}
</script>
