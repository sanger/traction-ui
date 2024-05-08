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
      v-show="hasUsedAliquots && hover"
      class="absolute z-1 bg-black text-white text-xs p-2 rounded"
      data-attribute="tooltip"
    >
      {{ tooltip }}
    </span>
  </div>
</template>
<script setup>
/**
 * @name PacbioRunWell
 * @description A single well in a Pacbio run plate
 */
import PacbioRunWellComponents from '@/config/PacbioRunWellComponents'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { ref, computed } from 'vue'

/**
 * Props for the component.
 * @type {Object}
 * @property {string} position - The position of the well. This prop is required.
 * @property {number} plateNumber - The number of the plate. This prop is required.
 * @property {boolean} interactive - Whether the well is interactive. This prop is required and defaults to true.
 */
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

/*
 * Define the emits for the component.
 * The component emits a 'click' event when the well is clicked.
 */
const emit = defineEmits(['click'])

/*
 * Create a store instance of the pacbioRunCreateStore.
 */
const store = usePacbioRunCreateStore()

/*
 * Define refs for the component.
 * The `hover` ref is used to determine if the well is being hovered over.
 */
const hover = ref(false)

/*
 * Computed property that returns the class names for the well.
 * @returns {Array} - An array of class names for the well.
 */
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

/*
 * Computed property that returns the required metadata fields for the well.
 * @returns {Array} - An array of required metadata fields for the well.
 */
const required_metadata_fields = computed(() => {
  return (
    PacbioRunWellComponents[store.smrtLinkVersion.name]?.reduce((result, field) => {
      field.required && result.push(field.value)
      return result
    }, []) || []
  )
})

/*
 * Computed property that returns the well from the store.
 * @returns {Object} - The well from the store.
 */
const storeWell = computed(() => {
  return store.getWell(props.plateNumber, props.position)
})

/*
 * Computed property that returns the tooltip for the well.
 * @returns {string} - The tooltip for the well.
 */
const tooltip = computed(() => {
  return storeWell.value?.used_aliquots
    ? [...storeWell.value.used_aliquots]
        .map(({ source_id, source_type }) => {
          const type = source_type === 'Pacbio::Pool' ? 'pools' : 'libraries'
          return store.tubeContents.find(
            (tubeContent) => source_id == tubeContent.id && type == tubeContent.type,
          ).barcode
        })
        .filter(Boolean)
        .join(',')
    : ''
})

/*
 * Computed property that returns whether the well has pools or libraries.
 * @returns {boolean} - Whether the well has pools or libraries.
 */
const hasUsedAliquots = computed(() => {
  return storeWell.value?.used_aliquots.length > 0
})

/*
 * Computed property that returns whether the well has valid metadata.
 * @returns {boolean} - Whether the well has valid metadata.
 */
const hasValidMetadata = computed(() => {
  return required_metadata_fields.value.every((field) => storeWell.value?.[field])
})

/*
 * Computed property that returns whether the well has some metadata.
 * @returns {boolean} - Whether the well has some metadata.
 */
const hasSomeMetadata = computed(() => {
  return required_metadata_fields.value.some((field) => storeWell.value?.[field])
})

/*
 * Computed property that returns the status of the well.
 * @returns {string} - The status of the well.
 */
const status = computed(() => {
  if (hasUsedAliquots.value && hasValidMetadata.value) {
    // Complete
    return 'bg-success text-white'
  } else if (hasUsedAliquots.value || hasSomeMetadata.value) {
    // Incomplete
    return 'bg-failure text-white'
  }
  // Empty
  return 'bg-gray-100 text-black'
})

/*
 * Method that is called when the well is clicked.
 * Emits a 'click' event with the position and plate number of the well.
 */
const onClick = () => {
  emit('click', props.position, props.plateNumber)
}

/*
 * Method that is called when a drag event is dropped on the well.
 * Sets the hover ref to false and updates the pool or library barcode.
 * @param {Event} event - The drag event.
 */
const drop = async (event) => {
  hover.value = false
  await updateUsedAliquotSource(event.dataTransfer.getData('barcode'))
}

/*
 * Method that updates the pool or library barcode for the well.
 * Fetches the well object from the store and updates the pools or libraries array with the barcode.
 * @param {string} barcode - The barcode of the pool or library.
 */
const updateUsedAliquotSource = async (barcode) => {
  const well = await store.getOrCreateWell(props.position, props.plateNumber)
  const { id, type, template_prep_kit_box_barcode } = store.tubeContentByBarcode(barcode)
  // should move to a createUsedAliquot method
  const source_type = type === 'pools' ? 'Pacbio::Pool' : 'Pacbio::Library'
  well.used_aliquots.push({
    id: '',
    source_id: id,
    source_type,
    barcode,
    volume: 0,
    concentration: 0,
    template_prep_kit_box_barcode,
  })
  store.updateWell({ well: well, plateNumber: props.plateNumber })
}
</script>
