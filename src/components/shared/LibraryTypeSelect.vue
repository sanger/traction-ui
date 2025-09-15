<template>
  <traction-field-group label="Library Type" label-for="library-type" layout="spacious">
    <traction-select
      id="library-type"
      :model-value="libraryType"
      :options="libraryTypeSelectOptions"
      data-attribute="library-type-list"
      @update:model-value="handleInput"
    ></traction-select>
  </traction-field-group>
</template>

<script setup>
import { computed, ref } from 'vue'
import useRootStore from '@/stores/index.js'

const rootStore = useRootStore()

const libraryTypes = ref(
  rootStore.libraryTypes.map(({ name, pipeline }) => ({ value: name, pipeline, text: name })),
)

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
})

const emit = defineEmits(['update:modelValue'])

const libraryType = computed(() => encode(props.modelValue))

const importOption = computed(() =>
  props.import ? [{ value: UNDEFINED, text: props.importText }] : [],
)

const libraryTypeSelectOptions = computed(() => [
  ...(props.pipeline
    ? libraryTypes.value.filter((lt) => lt.pipeline === props.pipeline)
    : libraryTypes.value),
  ...importOption.value,
])

function handleInput(input) {
  emit('update:modelValue', decode(input))
}
</script>

<style></style>
