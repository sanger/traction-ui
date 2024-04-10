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

<script>
/*
 * This field probably *shouldn't* render its own labels.
 */
import useSWRV from 'swrv'
import { ref } from 'vue'
import { filterByAttribute, mapAttribute } from '@/api/JsonApi'

// We want undefined (I've not specified a library) and null (I want NO library)
// select elements can't handle the former. So we encode it
const UNDEFINED = '_undefined'

const encode = (value) => (value === undefined ? UNDEFINED : value)
const decode = (value) => (value === UNDEFINED ? undefined : value === '' ? null : value)

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
    modelValue: {
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
    allowNone: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    const baseURL = ref(import.meta.env.VITE_TRACTION_BASE_URL)
    const { data: remoteLibraryTypes } = useSWRV(
      `${baseURL.value}/v1/library_types?fields[library_types]=name,pipeline`,
    )
    return { remoteLibraryTypes }
  },
  computed: {
    libraryType() {
      return encode(this.modelValue)
    },
    importOption() {
      if (this.import) {
        // undefined gets coerced into null, so we need some magic
        return [{ value: UNDEFINED, text: this.importText }]
      } else {
        return []
      }
    },
    emptyOption: ({ allowNone }) => (allowNone ? [{ value: '', text: 'None' }] : []),
    filters: ({ pipeline }) => (pipeline ? { pipeline } : {}),
    filteredLibraryTypes() {
      return filterByAttribute(this.remoteLibraryTypes?.data || [], this.filters)
    },
    libraryTypes() {
      return [
        ...mapAttribute(this.filteredLibraryTypes, 'name'),
        ...this.importOption,
        ...this.emptyOption,
      ]
    },
  },
  methods: {
    handleInput(input) {
      this.$emit('update:modelValue', decode(input))
    },
  },
}
</script>

<style></style>
