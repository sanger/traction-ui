<template>
  <div data-type="pool">
    <traction-section
      number="4"
      title="Pooled Samples"
      :tag="`${poolType}`"
      data-attribute="pool-type"
    >
      <div class="space-y-12">
        <div class="flex flex-col">
          <label class="text-left p-0">Select file</label>
          <traction-file
            id="qcFileInput"
            ref="qc-file-form-field"
            :state="parsedFile"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            accept="text/csv, .csv"
            size="sm"
            @input="uploadFile"
          ></traction-file>
        </div>
        <div>
          <traction-sub-section title="Pool information" class="py-6">
            <div class="grid gap-5 grid-cols-6 mb-10 text-sm min-h-32" data-type="pool-edit">
              <label> Auto tagging</label>
              <label v-if="!!tubeItem.barcode"> Pool Barcode </label>
              <label v-else></label>
              <label> Kit Barcode </label>
              <label> Volume </label>
              <label> Concentration </label>
              <label> Insert Size </label>
              <div class="w-full flex justify-center">
                <traction-toggle v-model="autoTag" data-attribute="check-box" />
              </div>
              <label v-if="!!tubeItem.barcode" data-attribute="barcode" class="font-bold flex-wrap">
                {{ tubeItem.barcode }}
              </label>
              <label v-else></label>
              <traction-input
                v-model="poolItem.kit_barcode"
                data-attribute="kit-barcode"
                :value="poolItem.kit_barcode"
              />
              <traction-input
                v-model="poolItem.volume"
                data-attribute="volume"
                :value="poolItem.volume"
              />
              <traction-input
                v-model="poolItem.concentration"
                data-attribute="concentration"
                :value="poolItem.concentration"
              />
              <traction-input
                v-model="poolItem.insert_size"
                data-attribute="insert-size"
                :value="poolItem.insert_size"
              />
            </div>
          </traction-sub-section>
        </div>
      </div>
    </traction-section>
    <OntPoolLibraryList :auto-tag="autoTag" :validated="validated" :notify="onFieldUpdate" />
    <div class="text-right py-8">
      <traction-button
        v-if="!persisted"
        data-action="create-pool"
        theme="create"
        :disabled="busy"
        @click="create()"
      >
        <span class="button-text">Create Pool </span>
        <traction-spinner v-show="busy"></traction-spinner>
      </traction-button>
      <traction-button
        v-if="persisted"
        data-action="update-pool"
        theme="update"
        :disabled="busy"
        @click="update()"
      >
        <span class="button-text">Update Pool </span>
        <traction-spinner v-show="busy"></traction-spinner>
      </traction-button>
    </div>
  </div>
</template>

<script>
import OntPoolLibraryList from '@/components/ont/OntPoolLibraryList'
import { createNamespacedHelpers } from 'vuex'
import { eachRecord } from '@/lib/csv/pacbio'

const { mapGetters, mapActions } = createNamespacedHelpers('traction/ont/pools')

/**
 * # OntPoolEdit
 *
 * Displays metadata about the current pool in the ont pooling store
 */
export default {
  name: 'OntPoolEdit',
  components: {
    OntPoolLibraryList,
  },
  data() {
    return {
      busy: false,
      autoTag: false,
      parsedFile: null,
      validated: true,
    }
  },
  computed: {
    ...mapGetters(['poolItem', 'tubeItem', 'selectedRequests']),
    persisted() {
      return !!this.poolItem.id
    },
    poolType() {
      switch (this.selectedRequests.length) {
        case 0:
          return 'Empty'
        case 1:
          return 'Library'
        default:
          return 'Pool'
      }
    },
  },
  methods: {
    ...mapActions(['createPool', 'updatePool', 'updateLibraryFromCsvRecord']),
    create() {
      this.busy = true
      this.createPool().then(({ success, barcode, errors }) => {
        success
          ? this.showAlert(
              `Pool successfully created with barcode ${barcode}`,
              'success',
              'pool-create-message',
            )
          : this.showAlert(errors, 'danger', 'pool-create-message')
        this.busy = false
      })
    },
    update() {
      this.busy = true
      this.validated = true
      this.updatePool().then(({ success, errors }) => {
        success
          ? this.showAlert(`Pool successfully updated`, 'success', 'pool-create-message')
          : this.showAlert(errors, 'danger', 'pool-create-message')
        this.busy = false
      })
    },
    // Allows users to upload a file to autopopulate the pool's selected libraries
    async uploadFile(newFile) {
      if (newFile === null) {
        this.parsedFile = null
        return
      }

      try {
        const csv = await newFile.text()
        eachRecord(csv, this.updateLibraryFromCsvRecord)
        this.parsedFile = true
      } catch (error) {
        console.error(error)
        this.showAlert(error, 'danger', 'pool-create-message')
        this.parsedFile = false
      }
    },
    // Function passed to child components for use in validation
    onFieldUpdate() {
      this.validated = false
    },
  },
}
</script>
