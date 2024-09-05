<template>
  <traction-field-group label="Data Type" label-for="data-type" layout="spacious">
    <traction-select
      id="data-type"
      :model-value="dataType"
      data-attribute="data-type-list"
      :options="dataTypes"
      @update:model-value="handleInput"
    ></traction-select
    ></traction-field-group>
</template>

<script>
import useSWRV from 'swrv'
import { filterByAttribute, mapAttribute } from '@/api/JsonApi'

const encode = (value) => (value === undefined ? 'basecalls and raw data' : value)
const decode = (value) => (value === '' ? null : value)

export default {
  name: 'DataTypeSelect',
  data() {
    return {
      dataType: encode(this.modelValue),
    }
  },
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
  emits: ['update:modelValue'],
  setup() {
    const baseURL = import.meta.env.VITE_TRACTION_BASE_URL
    const { data: remoteDataTypes } = useSWRV(
      `${baseURL}/v1/data_types?fields[data_types]=name,pipeline`,
    )
    return { remoteDataTypes }
  },
  computed: {
    // Same approach as src/components/shared/LibraryTypeSelect.vue
    filters: ({ pipeline }) => (pipeline ? { pipeline, name: 'basecalls and raw data' } : {}),
    filteredDataTypes() {
      return filterByAttribute(this.remoteDataTypes?.data || [], this.filters)
    },
    emptyOption: ({ allowNone }) => (allowNone ? [{ value: '', text: 'None' }] : []),
    dataTypes() {
      const dataTypesOptions = mapAttribute(this.filteredDataTypes, 'name').map((val) => {
        return {
          text: val,
          value: val,
        }
      })
      return [...dataTypesOptions, ...this.emptyOption]
    },
  },
  watch: {
    remoteDataTypes: {
      handler() {
        this.setDataType()
      },
      immediate: true,
    },
  },
  methods: {
    handleInput(input) {
      this.$emit('update:modelValue', decode(input))
    },
    setDataType() {
      if (this.dataTypes.length === 1) {
        this.dataType = encode(this.dataTypes[0].value)
        this.$emit('update:modelValue', this.dataTypes[0].value)
      }
    },
  },
}
</script>
