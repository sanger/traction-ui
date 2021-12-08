<template>
  <div v-if="selectedRequests" data-type="pool-library-list">
    <b-row>
      <b-col>
        <b-form-checkbox v-model="autoTag" name="check-button" switch data-attribute="auto-tagging">
          Autotagging
        </b-form-checkbox>
      </b-col>
      <b-col>
        <b-form-file
          id="qcFileInput"
          v-model="uploadedFile"
          :state="Boolean(uploadedFile)"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          accept="text/csv, .csv"
          size="sm"
        ></b-form-file>
      </b-col>
    </b-row>
    <b-table-simple>
      <b-thead>
        <b-tr>
          <b-th>
            Sample Name
          </b-th>
          <b-th>
            Source
          </b-th>
          <b-th>
            Tag
          </b-th>
          <b-th>
            Template prep kit box barcode
          </b-th>
          <b-th>
            Volume
          </b-th>
          <b-th>
            Concentration
          </b-th>
          <b-th>
            Insert Size
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <PacbioPoolLibraryEdit
          v-for="request in selectedRequests"
          :key="request.id"
          :request="request"
          :auto-tag="autoTag"
        ></PacbioPoolLibraryEdit>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import PacbioPoolLibraryEdit from '@/components/pacbio/PacbioPoolLibraryEdit'
import { createNamespacedHelpers } from 'vuex'
import { eachRecord } from '@/lib/csv/pacbio'

const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PacbioPoolLibraryList',
  components: {
    PacbioPoolLibraryEdit,
  },
  data() {
    return {
      autoTag: false,
      uploadedFile: null,
    }
  },
  computed: {
    ...mapGetters(['selectedRequests']),
  },
  watch: {
    async uploadedFile(newFile) {
      const csv = await newFile.text()
      eachRecord(csv, (record) => this.updateLibraryFromCsvRecord(record))
    },
  },
  methods: {
    ...mapActions(['updateLibraryFromCsvRecord']),
  },
}
</script>

<style scoped lang="scss">
th {
  font-size: 0.8em;
}
</style>
