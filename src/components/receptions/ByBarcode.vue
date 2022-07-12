<template>
  <div class="display-contents">
    <traction-section title="Scan Barcodes">
      <template #icon><BarcodeIcon /></template>
      <traction-textarea
        id="barcodes"
        v-model="barcodes"
        placeholder="Scan barcodes to import..."
        rows="4"
        max-rows="10"
        name="barcodes"
        class="text-base"
      />
    </traction-section>

    <traction-section title="Request Options">
      <div class="grid grid-cols-2">
        <traction-fieldset title="Shared Options">
          <LibraryTypeSelect
            v-model="libraryType"
            :label-cols="0"
            :allow-none="false"
            :import-text="`Import from ${title} (where available)`"
          />
          <traction-form-group
            label-cols="0"
            description="When not provided default is ToL (S4773)"
            label="Cost Code"
            label-for="cost_code"
            label-align="left"
            label-size="sm"
            class="text-base"
          >
            <traction-input id="cost_code" v-model="costCode"></traction-input>
          </traction-form-group>
        </traction-fieldset>
        <div>
          <traction-fieldset title="PacBio Options">
            <p>PacBio specific library options</p>
          </traction-fieldset>
          <traction-fieldset title="ONT Options">
            <p>ONT specific library options</p>
          </traction-fieldset>
        </div>
      </div>
    </traction-section>
    <traction-button
      id="importLabware"
      :disabled="isDisabled"
      class="ml-8 mr-8"
      theme="create"
      @click="importLabware"
    >
      Import {{ barcodeCount }} labware from {{ title }}
    </traction-button>
  </div>
</template>

<script>
import Api from '@/mixins/Api'
import LibraryTypeSelect from '@/components/shared/LibraryTypeSelect'
import BarcodeIcon from '@/icons/BarcodeIcon.vue'

export default {
  name: 'ReceptionByBarcode',
  components: {
    LibraryTypeSelect,
    BarcodeIcon,
  },
  mixins: [Api],
  props: {
    title: { type: String, required: true },
    source: { type: String, required: true },
    importFunction: { type: Function, required: true },
  },
  data() {
    return {
      barcodes: '',
      busy: false,
      libraryType: undefined,
      costCode: undefined,
    }
  },
  computed: {
    barcodeArray() {
      return this.barcodes.split(/\s/).filter(Boolean)
    },
    isDisabled() {
      return this.barcodeArray.length === 0 || this.busy
    },
    barcodeCount() {
      return this.barcodeArray.length
    },
  },
  methods: {
    async importLabware() {
      this.$emit('importStarted', {
        message: `Fetching ${this.barcodeCount} items from ${this.title}`,
      })
      try {
        const response = await this.importFunction({
          requests: this.api,
          barcodes: this.barcodeArray,
          libraryType: this.libraryType,
          costCode: this.costCode,
        })

        this.$emit('importLoaded', {
          source: this.source,
          requestAttributes: response.requestAttributes,
        })
      } catch (e) {
        console.error(e)
        this.$emit('importFailed', {
          message: e.toString(),
        })
      }
    },
  },
}
</script>

<style scoped></style>
