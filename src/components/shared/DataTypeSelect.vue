<template>
  <div>
    <traction-form-group
      label="Data Type"
      label-for="data-type"
      :label-cols="labelCols"
      :label-align="labelAlign"
      label-size="sm"
    >
      <traction-select
        id="data-type"
        :class="cssClass"
        :value="value"
        :options="dataTypes"
        @input="handleInput"
      ></traction-select>
    </traction-form-group>
  </div>
</template>

<script>
import useSWRV from 'swrv'
import { filterByAttribute, mapAttribute } from '@/api/JsonApi'

export const POSITION = {
  Left: 1, //Position on left
  Top: 2, // Position on top
}

export default {
  name: 'DataTypeSelect',
  props: {
    pipeline: {
      // Filter to only list data_types for a given pipeline, leave null
      // to apply no filters
      type: String,
      required: false,
      default: null,
    },
    value: {
      // The data type, we use value to allow us to simply bind it with v-model
      type: String,
      default: undefined,
    },
    labelCols: {
      type: Number,
      default: 2,
    },
    labelAlign: {
      type: String,
      default: 'left',
    },
    labelPosition: {
      type: [Number, String],
      default: () => POSITION.Left,
    },
  },
  setup() {
    const baseURL = import.meta.env.VITE_TRACTION_BASE_URL
    const { data: remoteDataTypes } = useSWRV(
      `${baseURL}/v1/data_types?fields[data_types]=name,pipeline`,
    )
    return { remoteDataTypes }
  },
  computed: {
    filters: ({ pipeline }) => (pipeline ? { pipeline } : {}),
    filteredDataTypes() {
      return filterByAttribute(this.remoteDataTypes?.data || [], this.filters)
    },
    dataTypes() {
      return mapAttribute(this.filteredDataTypes, 'name')
    },
    cssClass() {
      return {
        'text-sm': this.labelCols == 0,
      }
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
