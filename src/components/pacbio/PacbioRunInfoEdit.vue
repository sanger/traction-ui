<template>
  <div class="pacbioRunInfoEdit">
    <traction-section title="Run Details">
      <traction-field-group
        label="Run Name"
        for="run-name"
        description="Auto-generated traction name"
      >
        <traction-input
          id="run-name"
          v-model="store.run.name"
          placeholder="Run name"
          type="text"
          disabled
        />
      </traction-field-group>

      <traction-field-group
        v-if="!isRevio"
        label="DNA Control Complex Box Barcode"
        for="dna-control-complex-box-barcode"
      >
        <traction-input
          id="dna-control-complex-box-barcode"
          v-model="store.run.dna_control_complex_box_barcode"
          placeholder="DNA Control Complex Box Barcode"
          type="text"
          data-attribute="dna_control_complex_box_barcode"
        />
      </traction-field-group>

      <traction-field-group label="System Name" for="system-name">
        <!-- TODO: Not sure what this should be not v-model as the whole object needs to be updated -->
        <traction-select
          id="system-name"
          ref="systemName"
          :model-value="store.instrumentType.key"
          title="System Name"
          :options="instrumentTypeSelectOptions"
          data-attribute="system_name"
          :disabled="!newRecord"
          @update:model-value="store.setInstrumentData($event)"
        />
      </traction-field-group>

      <traction-field-group label="SMRT Link Version" for="smrt-link-version">
        <traction-select
          id="smrt-link-version"
          ref="smrtLinkVersion"
          :model-value="store.smrtLinkVersion.id"
          title="SMRT Link Version"
          :options="smrtLinkVersionSelectOptions"
          data-attribute="smrt_link_version"
          @update:model-value="store.setSmrtLinkVersion($event)"
        />
      </traction-field-group>

      <traction-field-group
        label="Barcodes and Concentrations"
        for="barcodes-and-concentrations"
        description="Barcodes & concentrations are automatically appended"
      >
        <traction-input
          id="barcodes-and-concentrations"
          v-model="store.run.barcodes_and_concentrations"
          placeholder="Barcodes and Concentrations"
          type="text"
          data-attribute="barcodes-and-concentrations"
          readonly
        />
      </traction-field-group>
    </traction-section>
    <div>
      <div class="flex flex-row w-full w-1/2 space-x-2 justify-end px-2">
        <traction-button data-action="show-annotations" theme="default" @click="showAnnotations()">
          {{ annotationsVisible ? 'Hide Annotations' : 'Show Annotations' }}
        </traction-button>
      </div>
      <div
        v-if="annotationsVisible"
        class="p-4 mb-4 mt-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm"
      >
        <annotation-list :parent="store.run" :annotation-types="annotationTypes" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes.js'
import {
  InstrumentTypeSelectOptionsType,
  SmrtLinkVersionSelectOptionsType,
} from '@/lib/SelectOptionsTypes'
import { computed, ref } from 'vue'
import AnnotationList from '@/components/AnnotationList.vue'

const store = usePacbioRunCreateStore()

defineProps({
  newRecord: {
    type: Boolean,
  },
})

// Makes an array of objects with value and text properties to make
// the options of smrt-link-version select drop-down list.
// Only includes 'active' versions in the list, unless this record already has an inactive version as its value.
const smrtLinkVersionSelectOptions = computed(() =>
  SmrtLinkVersionSelectOptionsType(Object.values(store.smrtLinkVersionList)).options(
    store.smrtLinkVersion,
  ),
)

// Returns an array of objects with value and text properties to make
// the options of instrument-type select drop-down list.
// Only includes 'active' versions in the list, unless this record already has an inactive version as its value.
const instrumentTypeSelectOptions = computed(() =>
  InstrumentTypeSelectOptionsType(Object.values(PacbioInstrumentTypes)).options(
    store.instrumentType,
  ),
)

const isRevio = computed(() => store.instrumentType.key === PacbioInstrumentTypes.Revio.key)

const annotationsVisible = ref(false)

const toggleAnnotations = () => {
  annotationsVisible.value = !annotationsVisible.value
}

const annotationTypes = computed(() => Object.values(store.resources.annotationTypes))

const showAnnotations = () => {
  store.setAnnotations({
    parent: store.run,
    annotatableType: 'Pacbio::Run',
  })
  toggleAnnotations()
}
</script>
