<template>
  <traction-select
    id="data-type"
    :model-value="dataType"
    data-attribute="data-type-list"
    :options="dataTypes"
    @update:model-value="handleInput"
  ></traction-select>
</template>

<script>
import useSWRV from 'swrv'
import { filterByAttribute, mapAttribute } from '@/api/JsonApi'

const encode = (value) => (value === undefined ? 'basecalls and raw data' : value)
export default {
  name: 'DataTypeSelect',
  props: {
    pipeline: {
      type: String,
      required: false,
      default: null,
    },
    modelValue: {
      type: String,
      default: undefined,
    },
  },
  emits: ['input'],
  setup() {
    const baseURL = import.meta.env.VITE_TRACTION_BASE_URL
    const { data: remoteDataTypes } = useSWRV(
      `${baseURL}/v1/data_types?fields[data_types]=name,pipeline`,
    )
    return { remoteDataTypes }
  },
  computed: {
    // Same approach as src/components/shared/LibraryTypeSelect.vue
    dataType() {
      return encode(this.modelValue)
    },
    filters: ({ pipeline }) => (pipeline ? { pipeline, name: 'basecalls and raw data' } : {}),
    filteredDataTypes() {
      return filterByAttribute(this.remoteDataTypes?.data || [], this.filters)
    },
    dataTypes() {
      return mapAttribute(this.filteredDataTypes, 'name')
    },
  },
  methods: {
    handleInput(input) {
      this.$emit('input', input)
    },
  },
}
</script>

<style></style>
