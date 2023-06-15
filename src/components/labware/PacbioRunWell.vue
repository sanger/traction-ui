<template>
  <div>
    <div
      :class="wellClassNames"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @drop="drop"
      @click="onWellClick(props.position)"
    >
      <p class="truncate font-light">{{ props.position }}</p>
    </div>
    <WellEdit ref="wellEditModalRef" class="modal" :position="props.position" />
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'


// TODO: This is largely copied from PacbioRunWellItem.vue
//       Since this is using vue composition API, we can't use the same vuex approach
//       Need to figure out a way to use vuex with composition API

const props = defineProps({
  position: {
    type: String,
    required: true,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
})

const hover = ref(false)
const wellEditModalRef = ref()

const wellClassNames = computed(() => {
  return [
    status(),
    hover.value && props.interactive
      ? 'ring ring-pink-600 ring-offset-1'
      : 'border border-gray-800',
    props.interactive ? 'cursor-pointer' : '',
    'flex flex-col justify-center mx-auto rounded-full text-xs font-semibold aspect-square w-full select-none',
  ]
})

function onWellClick(position) {
  if (!props.interactive) return
  wellEditModalRef.value.showModalForPosition(position)
}

const { getOrCreateWell } = mapActions('traction/pacbio/runCreate', ['getOrCreateWell'])
const { updateWell } = mapMutations('traction/pacbio/runCreate', ['updateWell'])
const { poolByBarcode, getWell, pools, smrtLinkVersion } = mapGetters('traction/pacbio/runCreate', [
  'poolByBarcode',
  'getWell',
  'pools',
  'smrtLinkVersion',
])

function storeWell() {
  return getWell(props.position)
}

function required_metadata_fields() {
  if (smrtLinkVersion.name == 'v11') {
    return [
      'movie_time',
      'on_plate_loading_concentration',
      'binding_kit_box_barcode',
      'generate_hifi',
    ]
  } else if (smrtLinkVersion.name == 'v12_revio') {
    return [
      'movie_acquisition_time',
      'include_base_kinetics',
      'library_concentration',
      'polymerase_kit',
      'pre_extension_time',
    ]
  }
  return []
}

function hasPools() {
  if (storeWell === undefined) return false
  return storeWell.pools.length > 0
}
function hasValidMetadata() {
  if (storeWell === undefined) return false
  return required_metadata_fields.every((field) => storeWell[field])
}
function hasSomeMetadata() {
  if (storeWell === undefined) return false
  return required_metadata_fields.some((field) => storeWell[field])
}

function status() {
  if (hasPools && hasValidMetadata) {
    return 'bg-green-400 text-white'
  } else if (hasPools || hasSomeMetadata) {
    return 'bg-red-400 text-white'
  } 
  return 'bg-gray-100 text-black'
}

async function updatePoolBarcode(barcode) {
  const well = await getOrCreateWell({ position: props.position })
  const { id } = poolByBarcode(barcode)
  well.pools.push(id)
  updateWell(well)
}

async function drop(event) {
  event.preventDefault()
  await updatePoolBarcode(event.dataTransfer.getData('barcode'))
}
</script>
