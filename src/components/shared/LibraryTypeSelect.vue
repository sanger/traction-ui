<template>
  <div>
    <b-form-group
      label="Library Type"
      label-for="library-type"
      :label-cols="labelCols"
      :label-align="labelAlign"
      label-size="sm"
    >
      <b-select
        id="library-type"
        :class="getClass()"
        :value="libraryType"
        :options="libraryTypes"
        @input="handleInput"
      ></b-select>
    </b-form-group>
  </div>
</template>

<script>
import useSWRV from 'swrv'
import { filterByAttribute, mapAttribute } from '@/api/JsonApi'

// We want undefined (I've not specified a library) and null (I want NO library)
// select elements can't handle the former. So we encode it
const UNDEFINED = '_undefined'

const encode = (value) => (value === undefined ? UNDEFINED : value)
const decode = (value) => (value === UNDEFINED ? undefined : value)

export const POSITION = {
  Left: 1, //Position on left
  Top: 2, // Position on top
}

export default {
  name: 'LibraryTypeSelect',
  props: {
    pipeline: {
      // Filter to only list library_types for a given pipeline, leave null
      // to apply no filters
      type: String,
      required: false,
      default: null,
    },
    value: {
      // The library type, we use value to allow us to simply bind it with v-model
      type: String,
      default: undefined,
    },
    importText: {
      type: String,
      default: 'Import from Sequencescape (where available)',
    },
    import: {
      // Whether to show the import option
      type: Boolean,
      default: true,
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
    allowNone: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const baseURL = import.meta.env.VITE_TRACTION_BASE_URL
    const { data: remoteLibraryTypes } = useSWRV(
      `${baseURL}/v1/library_types?fields[library_types]=name,pipeline`,
    )
    return { remoteLibraryTypes }
  },
  computed: {
    libraryType() {
      return encode(this.value)
    },
    importOption() {
      if (this.import) {
        // undefined gets coerced into null, so we need some magic
        return [{ value: UNDEFINED, text: this.importText }]
      } else {
        return []
      }
    },
    nullOption: ({ allowNone }) => (allowNone ? [{ value: null, text: 'None' }] : []),
    filters: ({ pipeline }) => (pipeline ? { pipeline } : {}),
    filteredLibraryTypes() {
      return filterByAttribute(this.remoteLibraryTypes?.data || [], this.filters)
    },
    libraryTypes() {
      return [
        ...mapAttribute(this.filteredLibraryTypes, 'name'),
        ...this.importOption,
        ...this.nullOption,
      ]
    },
  },
  methods: {
    handleInput(input) {
      this.$emit('input', decode(input))
    },
    getClass() {
      return {
        'text-sm': this.labelCols == 0,
      }
    },
  },
}
</script>

<style></style>
