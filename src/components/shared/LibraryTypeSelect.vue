<template>
  <div :class="getClass()">
    <label class="whitespace-nowrap justify-center item-center  text-left  text-lg mt-2">Library Type</label>
      <b-select
        id="library-type"
        :value="libraryType"
        :options="libraryTypes"
        class="item-center justify-center text-lg "
        @input="handleInput"
      ></b-select>
  </div>
</template>

<script>
// We want undefined (I've not specified a library) and null (I want NO library)
// jest select elements can't handle the former. So we encode it
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
    labelPosition: {
      type: Number,
      default: POSITION.Top,
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
    getClass() {
      return {
        'flex flex-row gap-x-4': this.labelPosition == POSITION.Left,
        'flex flex-col': this.labelPosition == POSITION.Top,
      }
    },
  },
}
</script>

<style></style>
