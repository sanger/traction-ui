<template>
  <div
    :class="classObject"
    :draggable="!!valid"
    data-attribute="selected-pool-library-list"
    @dragstart="drag(barcode, $event)"
    @click="expanded = !expanded"
  >
    <div class="flex justify-end">
      <button class="w-8 bg-gray-300 text-slate-400" @click="store.removePool(id)">x</button>
    </div>
    <div class="flex flex-row space-x-4 h-full w-full">
      <div class="flex flex-col px-2 w-1/4">
        <img src="/tube.png" />
        <traction-button
          :id="`editPool-${id}`"
          size="sm"
          theme="edit"
          :to="{ name: 'PacbioPoolCreate', params: { id: id } }"
          >Edit</traction-button
        >
      </div>
      <div class="flex flex-col w-3/4 text-left text-sm">
        <dl class="flex">
          <dt class="w-1/4">Barcode</dt>
          <dd class="w-3/4" data-attribute="barcode">{{ barcode }}</dd>
        </dl>
        <div v-if="showInfo">
          <dl class="flex">
            <dt class="w-1/4">Source</dt>
            <dd class="w-3/4" data-attribute="source-identifier">{{ source_identifier }}</dd>
          </dl>
          <dl class="flex">
            <dt class="w-1/4">Volume</dt>
            <dd class="w-3/4" data-attribute="volume">{{ volume || 'Unknown' }}</dd>
          </dl>
          <dl class="flex">
            <dt class="w-1/4">Concentration</dt>
            <dd class="w-3/4" data-attribute="concentration">
              {{ concentration || 'Unknown' }}
            </dd>
          </dl>
          <dl class="flex">
            <dt class="w-1/4">Template prep kit box barcode</dt>
            <dd class="w-3/4" data-attribute="template-prep-kit-box-barcode">
              {{ template_prep_kit_box_barcode || 'Unknown' }}
            </dd>
          </dl>
          <dl class="row flex">
            <dt class="w-1/4">Insert size</dt>
            <dd class="w-3/4" data-attribute="insert-size">
              {{ insert_size || 'Unknown' }}
            </dd>
          </dl>
          <dl class="row flex">
            <dt class="w-1/4">Libraries</dt>
            <dd class="w-3/4">
              <ul>
                <li v-for="library in libraries" :key="library.id">
                  {{ library.sample_name }}{{ library.group_id ? ' : ' + library.group_id : '' }}
                </li>
              </ul>
            </dd>
          </dl>
          <dl class="flex">
            <dt v-if="!valid">Errors</dt>
            <dd v-if="!valid">
              <ul>
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
              </ul>
            </dd>
          </dl>
        </div>
        <div v-else>Pool invalid. Click for more information</div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable vue/prop-name-casing -->
<script setup>
import { ref, computed } from 'vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'

const props = defineProps({
  id: {
    type: String,
    required: true,
    default: '',
  },
  barcode: {
    type: String,
    required: true,
    default: '',
  },
  libraries: {
    type: Array,
    required: true,
  },
  volume: {
    type: Number,
    required: false,
    default: null,
  },
  concentration: {
    type: Number,
    required: false,
    default: null,
  },
  template_prep_kit_box_barcode: {
    type: String,
    required: false,
    default: null,
  },
  insert_size: {
    type: Number,
    required: false,
    default: null,
  },
  source_identifier: {
    type: String,
    required: false,
    default: 'Unknown',
  },
  run_suitability: {
    type: Object,
    required: true,
  },
  closeable: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const store = usePacbioRunCreateStore()
const img = new Image()
img.src = '/tube.png'
const expanded = ref(false)
const valid = computed(() => props.run_suitability.ready_for_run)
const showInfo = computed(() => valid.value || expanded.value)
const errors = computed(() => props.run_suitability.formattedErrors)
const classObject = computed(() => {
  return `m-1 border-2 cursor-pointer rounded-md pb-2  ${
    valid.value ? 'hover:bg-gray-200' : 'failure-style'
  }`
})
const drag = (barcode, event) => {
  event.dataTransfer.setDragImage(img, 120, 50)
  event.dataTransfer.setData('barcode', barcode)
}
</script>
