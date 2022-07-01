<template>
  <flagged-feature name="dpl_277_enable_general_reception">
    <template #disabled
      >General reception is disabled, please use the pipeline specific receptions</template
    >

    <loading-full-screen-modal v-bind="modalState"></loading-full-screen-modal>

    <traction-heading level="4" :show-border="true"
      >Source
      <traction-menu
        ><traction-menu-item
          v-for="(receptionItem, index) in receptions"
          :key="index"
          :active="index == sourceIndex"
          @click.native="setSource(index)"
          >{{ receptionItem.name }}</traction-menu-item
        >
      </traction-menu></traction-heading
    >

    <component
      :is="receptionComponent"
      v-bind="receptionOptions"
      @importStarted="importStarted"
      @importFailed="importFailed"
      @importLoaded="importLoaded"
    ></component>
  </flagged-feature>
</template>

<script>
import Api from '@/mixins/Api'
import { createLabware } from '@/services/traction/Pacbio'
import Receptions from '@/lib/receptions'

// We don't expect the modal to display without a message. If we end up in this
// state then something has gone horribly wrong.
const stuckModal =
  "We appear to be stuck, this shouldn't happen. Please contact support, and try reloading the page"
const defaultModal = () => ({ visible: false, message: stuckModal })

export default {
  name: 'GeneralReception',
  mixins: [Api],
  props: {
    receptions: {
      type: Array,
      default: () => Receptions,
    },
  },
  data: () => ({
    modalState: defaultModal(),
    sourceIndex: 0,
  }),
  computed: {
    reception: ({ receptions, sourceIndex }) => receptions[sourceIndex],
    receptionComponent: ({ reception }) => reception.component,
    receptionOptions: ({ reception }) => reception.props,
  },
  methods: {
    importStarted({ message }) {
      this.modalState = {
        visible: true,
        message,
      }
    },
    clearModal() {
      this.modalState = defaultModal()
    },
    importFailed({ message }) {
      this.clearModal()
      this.showAlert(message, 'danger')
    },
    importLoaded({ requestAttributes, source }) {
      this.clearModal()
      {
        requestAttributes, source
      }
    },
    setSource(reception) {
      this.sourceIndex = reception
    },
    async createTractionPlates() {
      this.busy = true
      const response = await createLabware({
        requests: this.requests,
        barcodes: this.barcodeArray,
        libraryType: this.libraryType,
        costCode: this.costCode,
      })
      this.showAlert(response.message, response.status)
      this.busy = false
    },
  },
}
</script>

<style scoped></style>
