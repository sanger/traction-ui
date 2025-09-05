<template>
  <traction-field-group label="Library Type" label-for="library-type" layout="spacious">
    <traction-select
      id="library-type"
      :model-value="libraryType"
      :options="libraryTypes"
      data-attribute="library-type-list"
      @update:model-value="handleInput"
    ></traction-select>
  </traction-field-group>
</template>

<script setup>
import { computed } from 'vue'
import { groupByAttribute } from '@/stores/utilities/root.js'
import { extractAttributes } from '@/api/JsonApi.js'

const UNDEFINED = '_undefined'

const encode = (value) => (value === undefined ? UNDEFINED : value)
const decode = (value) => (value === UNDEFINED ? undefined : value === '' ? null : value)

const props = defineProps({
  pipeline: {
    type: String,
    required: false,
    default: null,
  },
  modelValue: {
    type: String,
    default: undefined,
  },
  importText: {
    type: String,
    default: 'Import from Sequencescape (where available)',
  },
  import: {
    type: Boolean,
    default: true,
  },
  allowNone: {
    type: Boolean,
    default: true,
  },
})

const remoteLibraryTypes = [
  {
    id: '1',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/1' },
    attributes: {
      name: 'Pacbio_HiFi',
      pipeline: 'pacbio',
      created_at: '2024-11-19T10:09:21.311Z',
      updated_at: '2024-11-19T10:09:21.311Z',
      external_identifier: 'HiFi Reads',
      active: true,
    },
  },
  {
    id: '2',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/2' },
    attributes: {
      name: 'Pacbio_HiFi_mplx',
      pipeline: 'pacbio',
      created_at: '2024-11-19T10:09:21.313Z',
      updated_at: '2024-11-19T10:09:21.313Z',
      external_identifier: 'HiFi Reads',
      active: true,
    },
  },
  {
    id: '3',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/3' },
    attributes: {
      name: 'Pacbio_Microbial_mplx',
      pipeline: 'pacbio',
      created_at: '2024-11-19T10:09:21.315Z',
      updated_at: '2024-11-19T10:09:21.315Z',
      external_identifier: 'Microbial Assembly',
      active: true,
    },
  },
  {
    id: '4',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/4' },
    attributes: {
      name: 'Pacbio_IsoSeq',
      pipeline: 'pacbio',
      created_at: '2024-11-19T10:09:21.317Z',
      updated_at: '2024-11-19T10:09:21.317Z',
      external_identifier: 'Iso-Seq Method',
      active: true,
    },
  },
  {
    id: '5',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/5' },
    attributes: {
      name: 'PacBio_IsoSeq_mplx',
      pipeline: 'pacbio',
      created_at: '2024-11-19T10:09:21.319Z',
      updated_at: '2024-11-19T10:09:21.319Z',
      external_identifier: 'Iso-Seq Method',
      active: true,
    },
  },
  {
    id: '6',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/6' },
    attributes: {
      name: 'PacBio_Ultra_Low_Input',
      pipeline: 'pacbio',
      created_at: '2024-11-19T10:09:21.321Z',
      updated_at: '2024-11-19T10:09:21.321Z',
      external_identifier: 'HiFi Reads',
      active: true,
    },
  },
  {
    id: '7',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/7' },
    attributes: {
      name: 'PacBio_Ultra_Low_Input_mplx',
      pipeline: 'pacbio',
      created_at: '2024-11-19T10:09:21.323Z',
      updated_at: '2024-11-19T10:09:21.323Z',
      external_identifier: 'HiFi Reads',
      active: true,
    },
  },
  {
    id: '8',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/8' },
    attributes: {
      name: 'Pacbio_Amplicon',
      pipeline: 'pacbio',
      created_at: '2024-11-19T10:09:21.325Z',
      updated_at: '2024-11-19T10:09:21.325Z',
      external_identifier: 'HiFi Reads',
      active: true,
    },
  },
  {
    id: '9',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/9' },
    attributes: {
      name: 'ONT_GridIon',
      pipeline: 'ont',
      created_at: '2024-11-19T10:09:21.329Z',
      updated_at: '2024-11-19T10:09:21.329Z',
      external_identifier: null,
      active: true,
    },
  },
  {
    id: '10',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/10' },
    attributes: {
      name: 'ONT_GridIon_mplx',
      pipeline: 'ont',
      created_at: '2024-11-19T10:09:21.332Z',
      updated_at: '2024-11-19T10:09:21.332Z',
      external_identifier: null,
      active: true,
    },
  },
  {
    id: '11',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/11' },
    attributes: {
      name: 'ONT_PromethIon',
      pipeline: 'ont',
      created_at: '2024-11-19T10:09:21.334Z',
      updated_at: '2024-11-19T10:09:21.334Z',
      external_identifier: null,
      active: true,
    },
  },
  {
    id: '12',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/12' },
    attributes: {
      name: 'ONT_PromethIon_mplx',
      pipeline: 'ont',
      created_at: '2024-11-19T10:09:21.337Z',
      updated_at: '2024-11-19T10:09:21.337Z',
      external_identifier: null,
      active: true,
    },
  },
  {
    id: '13',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/13' },
    attributes: {
      name: 'ONT_PromethIon_High_Quality',
      pipeline: 'ont',
      created_at: '2024-11-19T10:09:21.339Z',
      updated_at: '2024-11-19T10:09:21.339Z',
      external_identifier: null,
      active: true,
    },
  },
  {
    id: '14',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/14' },
    attributes: {
      name: 'ONT_Ultralong',
      pipeline: 'ont',
      created_at: '2024-11-19T10:09:21.341Z',
      updated_at: '2024-11-19T10:09:21.341Z',
      external_identifier: null,
      active: true,
    },
  },
  {
    id: '16',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/16' },
    attributes: {
      name: 'Pacbio_Ampli_Fi',
      pipeline: 'pacbio',
      created_at: '2025-06-09T14:07:58.963Z',
      updated_at: '2025-06-09T14:07:58.963Z',
      external_identifier: '>=3kb amplicons',
      active: true,
    },
  },
  {
    id: '18',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/18' },
    attributes: {
      name: 'Pacbio_Kinnex_Full_Length',
      pipeline: 'pacbio',
      created_at: '2025-06-09T14:07:58.993Z',
      updated_at: '2025-06-09T14:07:58.993Z',
      external_identifier: 'Kinnex full-length RNA',
      active: true,
    },
  },
  {
    id: '19',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/19' },
    attributes: {
      name: 'Pacbio_AmpliFi',
      pipeline: 'pacbio',
      created_at: '2025-06-09T15:37:54.004Z',
      updated_at: '2025-06-09T15:37:54.004Z',
      external_identifier: '>=3kb amplicons',
      active: true,
    },
  },
  {
    id: '20',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/20' },
    attributes: {
      name: 'Pacbio_Kinnex_Single_Cell_3',
      pipeline: 'pacbio',
      created_at: '2025-06-09T15:37:54.025Z',
      updated_at: '2025-06-09T15:37:54.025Z',
      external_identifier: 'Kinnex single-cell RNA',
      active: true,
    },
  },
  {
    id: '21',
    type: 'library_types',
    links: { self: 'http://localhost:3100/v1/library_types/21' },
    attributes: {
      name: 'Pacbio_Kinnex_Single_Cell_5',
      pipeline: 'pacbio',
      created_at: '2025-06-09T15:37:54.030Z',
      updated_at: '2025-06-09T15:37:54.030Z',
      external_identifier: 'Kinnex single-cell RNA',
      active: true,
    },
  },
]

const emit = defineEmits(['update:modelValue'])

const libraryType = computed(() => encode(props.modelValue))

const importOption = computed(() =>
  props.import ? [{ value: UNDEFINED, text: props.importText }] : [],
)

const emptyOption = computed(() => (props.allowNone ? [{ value: '', text: 'None' }] : []))

const groupedLibraryTypes = computed(() =>
  groupByAttribute({ data: remoteLibraryTypes, key: 'pipeline', fn: extractAttributes }),
)

const filteredLibraryTypes = computed(() =>
  props.pipeline
    ? groupedLibraryTypes.value[props.pipeline]
    : Object.values(groupedLibraryTypes.value).flat(),
)

const libraryTypes = computed(() => [
  ...filteredLibraryTypes.value.map(({ name }) => ({ value: name, text: name })),
  ...importOption.value,
  ...emptyOption.value,
])

function handleInput(input) {
  emit('update:modelValue', decode(input))
}
</script>

<style></style>
