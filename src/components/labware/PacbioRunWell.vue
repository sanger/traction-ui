<template>
  <div>
    <div
      :class="wellClassNames"
      data-attribute="pacbio-run-well"
      @mouseover.prevent="hover = true"
      @mouseleave.prevent="hover = false"
      @drop.prevent="drop"
      @dragenter.prevent
      @dragover.prevent="hover = true"
      @dragleave.prevent="hover = false"
      @click="onClick"
    >
      <p class="truncate font-light">{{ position }}</p>
    </div>
    <span
      v-if="hasPoolsOrLibraries && hover"
      class="absolute z-1 bg-black text-white text-xs p-2 rounded"
      data-attribute="tooltip"
    >
      {{ tooltip }}
    </span>
  </div>
</template>
<script setup>
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { ref, computed } from 'vue'

const props = defineProps({
  position: {
    type: String,
    required: true,
  },
  plateNumber: {
    type: Number,
    required: true,
  },
  interactive: {
    type: Boolean,
    required: true,
    default: true,
  },
})
const emit = defineEmits(['click'])

const store = usePacbioRunCreateStore()

const hover = ref(false)

const wellClassNames = computed(() => {
  return [
    status.value,
    hover.value && props.interactive
      ? 'ring ring-pink-600 ring-offset-1'
      : 'border border-gray-800',
    props.interactive ? 'cursor-pointer' : '',
    'flex flex-col justify-center mx-auto rounded-full text-xs font-semibold aspect-square w-full select-none transition duration-200 ease-out',
  ]
})

const required_metadata_fields = computed(() => {
  if (store.smrtLinkVersion.name == 'v11') {
    return [
      'movie_time',
      'on_plate_loading_concentration',
      'binding_kit_box_barcode',
      'generate_hifi',
    ]
  } else if (store.smrtLinkVersion.name == 'v12_revio') {
    return [
      'movie_acquisition_time',
      'include_base_kinetics',
      'library_concentration',
      'polymerase_kit',
      'pre_extension_time',
    ]
  }
  return []
})
const storeWell = computed(() => {
  const value = store.getWell(props.plateNumber, props.position)
  return value ? { ...value } : undefined
})

const tooltip = computed(() => {
  return storeWell.value.pools
    ?.map((p) => {
      return store.tubeContents.find((tubeContent) => p == tubeContent.id).barcode
    })
    .concat(
      storeWell.value.libraries?.map((l) => {
        return store.tubeContents.find((tubeContent) => l == tubeContent.id).barcode
      }),
    )
    .filter(Boolean)
    .join(',')
})

const hasPoolsOrLibraries = computed(() => {
  if (storeWell.value === undefined) return false
  return storeWell.value.pools.length > 0 || storeWell.value.libraries.length > 0
})

const hasValidMetadata = computed(() => {
  if (storeWell.value === undefined) return false
  return required_metadata_fields.value.every((field) => storeWell.value[field])
})

const hasSomeMetadata = computed(() => {
  if (storeWell.value === undefined) return false
  return required_metadata_fields.value.some((field) => storeWell.value[field])
})

const status = computed(() => {
  if (hasPoolsOrLibraries.value && hasValidMetadata.value) {
    // Complete
    return 'bg-success text-white'
  } else if (hasPoolsOrLibraries.value || hasSomeMetadata.value) {
    // Incomplete
    return 'bg-failure text-white'
  }
  // Empty
  return 'bg-gray-100 text-black'
})

const onClick = () => {
  emit('click', props.position, props.plateNumber)
}

const drop = async (event) => {
  hover.value = false
  await updatePoolLibraryBarcode(event.dataTransfer.getData('barcode'))
}

const updatePoolLibraryBarcode = async (barcode) => {
  const well = await store.getOrCreateWell(props.position, props.plateNumber)
  const { id, type } = store.tubeContentByBarcode(barcode)
  type === 'libraries' ? well.libraries.push(id) : type === 'pools' ? well.pools.push(id) : null
  store.updateWell({ well: well, plateNumber: props.plateNumber })
}
</script>
