<template>
  <b-form-group label="Library Type" label-for="library-type" :label-cols="labelCols">
    <b-select
      id="library-type"
      :value="libraryType"
      :options="libraryTypes"
      @input="handleInput"
    ></b-select>
  </b-form-group>
</template>

<script>
// We want undefined (I've not specified a library) and null (I want NO library)
// jest select elements can't handle the former. So we encode it
const UNDEFINED = '_undefined'

const encode = (value) => (value === undefined ? UNDEFINED : value)
const decode = (value) => (value === UNDEFINED ? undefined : value)

export default {
  name: 'LibraryTypeSelect',
  props: {
    pipeline: {
      type: String,
      required: true,
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
    libraryTypes() {
      return [
        ...this.$store.state.traction[this.pipeline].libraryTypes,
        ...this.importOption,
        { value: null, text: 'None' },
      ]
    },
  },
  methods: {
    handleInput(input) {
      this.$emit('input', decode(input))
    },
  },
}
</script>

<style></style>
