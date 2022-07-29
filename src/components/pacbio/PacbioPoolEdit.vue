<template>
  <div data-type="pool">
    <traction-section title="Pooled Samples" :tag="`${poolType}`">
      <div class="space-y-8">
        <div>
          <traction-sub-section title="Select file">
            <traction-file-browser
              ref-elem="qc-file-form-field"
              ready="parsedFile"
              file-types="text/csv, .csv"
              input-action="uploadFile"
            />
          </traction-sub-section>
        </div>
        <div>
          <traction-sub-section title="Apply All">
            <div class="grid gap-5 grid-cols-5 mb-10 text-sm">
              <label> Auto tagging</label>
              <label>Template Prep Kit Box Barcode </label>
              <label> Volume</label>
              <label> Concentration</label>
              <label> Insert Size</label>
              <div class="w-full flex justify-center">
                <traction-toggle v-model="autoTag" />
              </div>
              <traction-text-field
                value-field="poolItem.template_prep_kit_box_barcode"
                data-attribute-value="template-prep-kit-box-barcode"
                place-holder-text="Template Prep Kit Box Barcode"
              />
              <traction-text-field
                value-field="poolItem.volume"
                data-attribute-value="volume"
                place-holder-text="Volume"
              />
              <traction-text-field
                value-field="poolItem.concentration"
                data-attribute-value="concentration"
                place-holder-text="Concentration"
              />
              <traction-text-field
                value-field="poolItem.insert_size"
                data-attribute-value="insert-size"
                place-holder-text="Insert Size"
              />
            </div>
          </traction-sub-section>
        </div>
      </div>
    </traction-section>
    <PacbioPoolLibraryList :auto-tag="autoTag" />
    <div class="text-right py-8">
      <traction-button>
        <span class="button-text">Create Pool </span>
        <traction-spinner v-show="busy" small></traction-spinner
      ></traction-button>
      <traction-button>
        <span class="button-text">Update Pool </span>
        <traction-spinner v-show="busy" small></traction-spinner>
      </traction-button>
    </div>
  </div>
</template>

<script>
import PacbioPoolLibraryList from '@/components/pacbio/PacbioPoolLibraryList'
import { createNamespacedHelpers } from 'vuex'
import { eachRecord } from '@/lib/csv/pacbio'
import TractionFileBrowser from '../shared/TractionFileBrowser.vue'
import TractionTextField from '../shared/TractionTextField.vue'

const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PoolEdit',
  components: {
    PacbioPoolLibraryList,
    TractionFileBrowser,
    TractionTextField,
  },
  data() {
    return {
      busy: false,
      autoTag: false,
      parsedFile: null,
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
      this.updatePool().then(({ success, errors }) => {
        success
          ? this.showAlert(`Pool successfully updated`, 'success', 'pool-create-message')
          : this.showAlert(errors, 'danger', 'pool-create-message')
        this.busy = false
      })
    },
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
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';

.button-text {
  padding-right: 2px;
  position: relative;
  top: 2px;
}
.custom-select,
.form-control {
  font-size: 0.8em;
}
.pool-edit {
  padding-bottom: 5px;
  padding-top: 5px;
}
.td-empty {
  width: 110px;
}
.barcode {
  width: 250px;
  font-size: 0.8em;
  font-weight: bold;
  text-align: right;
}
.pool-attribute {
  width: 90px;
}
.template-prep-kit-box-barcode {
  width: 120px;
}

.col {
  // See https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor/Guide_to_scroll_anchoring
  // When the DOM content changes, the browser uses a 'scroll-anchor' to try and
  // prevent the viewport visibly jumping around as the DOM content re-renders.
  // Under some circumstances, which I haven't been able to reproduce, the
  // browser appears to use elements in this column as the anchor. This causes
  // the page to track elements in this column as wells are added to the pool,
  // making selection tricky. This CSS property *should* stop the browser using
  // these elements as anchors.
  overflow-anchor: none;
}
</style>
