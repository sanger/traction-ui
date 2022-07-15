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
        <!-- Temporarily add padding -->
        <traction-fieldset title="Shared Options" class="pr-8">
          <LibraryTypeSelect
            v-model="requestOptions.library_type"
            :label-cols="0"
            :allow-none="false"
            :import-text="`Import from ${title} (where available)`"
          />
          <traction-field-group label="Cost Code" attribute="cost_code" for="cost_code">
            <traction-input id="cost_code" v-model="requestOptions.cost_code"></traction-input>
          </traction-field-group>
        </traction-fieldset>
        <div>
          <traction-fieldset
            v-for="optionForm in requestOptionForms"
            :key="optionForm.title"
            v-bind="optionForm"
            v-model="requestOptions"
          ></traction-fieldset>
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
import { ReceptionForms, defaultRequestOptions } from '@/lib/receptions'

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
    requestOptionForms: {
      type: Array,
      required: false,
      default: () => ReceptionForms,
    },
  },
  data() {
    return {
      barcodes: '',
      requestOptions: defaultRequestOptions(),
    }
  },
  computed: {
    barcodeArray: ({ barcodes }) => barcodes.split(/\s/).filter(Boolean),
    isDisabled: ({ barcodeArray }) => barcodeArray.length === 0,
    barcodeCount: ({ barcodeArray }) => barcodeArray.length,
    presentRequestOptions: ({ requestOptions }) =>
      Object.fromEntries(Object.entries(requestOptions).filter(([, v]) => v)),
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
          requestOptions: this.presentRequestOptions,
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
