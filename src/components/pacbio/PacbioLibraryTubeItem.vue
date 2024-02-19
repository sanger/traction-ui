<template>
  <div
    :class="classes"
    :draggable="!!valid"
    data-attribute="selected-pool-library-list"
    @dragstart="drag(barcode, $event)"
    @click="expanded = !expanded"
  >
    <div class="flex flex-row">
      <div class="flex flex-col h-full w-full">
        <div class="flex flex-row w-full p-2 items-center border-b-2">
          <p class="text-xl font-bold w-full px-2 text-left" data-attribute="barcode">{{ barcode }}</p>
          <button class="text-xl h-8 w-8 m-0 leading-none" @click="store.removeLibrary(id)">
            x
          </button>
        </div>
        <div class="flex flex-row text-left text-sm w-full">
          <div class="flex flex-col justify-center w-1/4">
            <img src="/tube.png" />
          </div>
          <div v-if="valid || expanded" class="flex-col w-full border-l">
            <dl class="flex space-x-4 bg-gray-200 p-1 px-4">
              <dt class="w-1/4 text-gray-500 font-bold">Source</dt>
              <dd class="w-3/4" data-attribute="source-identifier">{{ source_identifier }}</dd>
            </dl>
            <dl class="flex space-x-4 p-1 px-4">
              <dt class="w-1/4 text-gray-500 font-bold">Volume</dt>
              <dd class="w-3/4" data-attribute="volume">{{ volume || 'Unknown' }}</dd>
            </dl>
            <dl class="flex space-x-4 bg-gray-200 p-1 px-4">
              <dt class="w-1/4 text-gray-500 font-bold">Concentration</dt>
              <dd class="w-3/4" data-attribute="concentration">
                {{ concentration || 'Unknown' }}
              </dd>
            </dl>
            <dl class="flex space-x-4 p-1 px-4">
              <dt class="w-1/4 text-gray-500 font-bold">Template prep kit box barcode</dt>
              <dd class="w-3/4" data-attribute="template-prep-kit-box-barcode">
                {{ template_prep_kit_box_barcode || 'Unknown' }}
              </dd>
            </dl>
            <dl class="flex space-x-4 bg-gray-200 p-1 px-4">
              <dt class="w-1/4 text-gray-500 font-bold">Insert size</dt>
              <dd class="w-3/4" data-attribute="insert-size">
                {{ insert_size || 'Unknown' }}
              </dd>
            </dl>
            <dl class="flex space-x-4 p-1 px-4">
              <dt class="w-1/4 text-gray-500 font-bold">Sample and Tag</dt>
              <dd class="w-3/4" data-attribute="sample-name">
                {{ sample_name }}{{ group_id ? ' : ' + group_id : '' }}
              </dd>
            </dl>
            <dl v-if="!run_suitability.ready_for_run" class="flex">
              <dt>Errors</dt>
              <dd>
                <ul>
                  <li v-for="(error, index) in errors" :key="index">
                    {{ error }}
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
          <div v-else>Library invalid. Click for more information</div>
        </div>
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
  source_identifier: {
    type: String,
    required: false,
    default: '',
  },
  volume: {
    type: Number,
    required: false,
    default: 0,
  },
  concentration: {
    type: Number,
    required: false,
    default: 0,
  },
  template_prep_kit_box_barcode: {
    type: String,
    required: false,
    default: '',
  },
  insert_size: {
    type: Number,
    required: false,
    default: 0,
  },
  sample_name: {
    type: String,
    required: false,
    default: '',
  },
  group_id: {
    type: String,
    required: false,
    default: '',
  },
  run_suitability: {
    type: Object,
    required: true,
  },
})

const expanded = ref(false)
const store = usePacbioRunCreateStore()
const valid = computed(() => props.run_suitability.ready_for_run)
const errors = computed(() => {
  return props.run_suitability.errors.map((error) => error.detail)
})
const classes = computed(
  () =>
    `shadow-md border cursor-pointer rounded-md ${valid.value ? 'hover:border-green-400 transition-all duration-200 ' : 'failure-style'}`,
)
const img = new Image()
img.src = '/tube.png'

function drag(barcode, event) {
  event.dataTransfer.setDragImage(img, 120, 50)
  event.dataTransfer.setData('barcode', barcode)
}
</script>
