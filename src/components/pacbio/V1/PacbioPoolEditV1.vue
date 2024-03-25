<template>
  <div data-type="pool">
    <traction-section
      number="4"
      title="Pooled Samples"
      :tag="`${poolType}`"
      data-attribute="pool-type"
    >
      <div>
        <div>
          <label class="flex text-left" for="qcFileInput">Select file</label>
          <div :class="['w-full', `${border}`]">
            <input
              id="qcFileInput"
              class="block w-full rounded border file:border-0"
              type="file"
              accept="text/csv, .csv"
              @change="uploadFile"
            />
          </div>
        </div>

        <div>
          <traction-sub-section title="Pool information" class="mt-2 py-6">
            <div class="flex flex-row gap-x-4" data-type="pool-edit">
              <fieldset class="flex flex-col items-center gap-y-4">
                <traction-label>Auto tagging</traction-label>
                <traction-toggle v-model="autoTag" data-attribute="check-box" />
              </fieldset>
              <fieldset v-if="!!tubeItem.barcode" class="flex flex-col">
                <traction-label class="h-full">Pool Barcode</traction-label>
                <traction-label
                  v-if="!!tubeItem.barcode"
                  data-attribute="barcode"
                  class="font-bold text-nowrap"
                >
                  {{ tubeItem.barcode }}
                </traction-label>
              </fieldset>
              <fieldset class="flex flex-col">
                <traction-label class="h-full">Template Prep Kit Box Barcode</traction-label>
                <traction-field-error
                  data-attribute="template_prep_kit_box_barcode-error"
                  :error="poolErrorsFor('template_prep_kit_box_barcode')"
                  :with-icon="!!poolItem.errors?.template_prep_kit_box_barcode"
                >
                  <traction-input
                    v-model="poolItem.template_prep_kit_box_barcode"
                    data-attribute="template-prep-kit-box-barcode"
                  />
                </traction-field-error>
              </fieldset>
              <fieldset class="flex flex-col">
                <traction-label class="h-full">Volume</traction-label>
                <traction-field-error
                  data-attribute="volume-error"
                  :error="poolErrorsFor('volume')"
                  :with-icon="!!poolItem.errors?.volume"
                >
                  <traction-input v-model="poolItem.volume" data-attribute="volume" />
                </traction-field-error>
              </fieldset>
              <fieldset class="flex flex-col">
                <traction-label class="h-full">Concentration</traction-label>
                <traction-field-error
                  data-attribute="concentration-error"
                  :error="poolErrorsFor('concentration')"
                  :with-icon="!!poolItem.errors?.concentration"
                >
                  <traction-input v-model="poolItem.concentration" data-attribute="concentration" />
                </traction-field-error>
              </fieldset>
              <fieldset class="flex flex-col">
                <traction-label class="h-full">Insert Size</traction-label>
                <traction-field-error
                  data-attribute="insert_size-error"
                  :error="poolErrorsFor('insert_size')"
                  :with-icon="!!poolItem.errors?.insert_size"
                >
                  <traction-input v-model="poolItem.insert_size" data-attribute="insert-size" />
                </traction-field-error>
              </fieldset>
            </div>
          </traction-sub-section>
        </div>
      </div>
    </traction-section>
    <PacbioPoolLibraryList :auto-tag="autoTag" :validated="validated" :notify="onFieldUpdate" />
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
import PacbioPoolLibraryList from '@/components/pacbio/V1/PacbioPoolLibraryListV1.vue'
import { createNamespacedHelpers } from 'vuex'
import { eachRecord } from '@/lib/csv/pacbio'
const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')
export default {
  name: 'PoolEdit',
  components: {
    PacbioPoolLibraryList,
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
    border() {
      if (this.parsedFile === null) return 'border-0'
      else {
        const borderColour = this.parsedFile ? 'border-success' : 'border-failure'
        return `rounded border ${borderColour}`
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
    async uploadFile(evt) {
      if (evt?.target?.files?.length) {
        const file = evt.target.files[0]
        try {
          const csv = await file.text()
          eachRecord(csv, this.updateLibraryFromCsvRecord)
          this.parsedFile = true
        } catch (error) {
          console.error(error)
          this.showAlert(error, 'danger', 'pool-create-message')
          this.parsedFile = false
        }
      } else {
        this.parsedFile = null
        return
      }
    },

    // Function passed to child components in notify prop, to be used when any attribute
    // in the child component is changed. The validated flag is reset to true when the user
    // clicks the update button and the changed values are checked and saved.
    onFieldUpdate() {
      this.validated = false
    },
  },
}
</script>
