<template>
  <div
    :class="classes"
    :draggable="!!valid"
    data-attribute="selected-library-list"
    @dragstart="drag(barcode, $event)"
  >
    <div class="flex justify-end">
      <button class="w-8 bg-gray-300 text-slate-400" @click="store.removeLibrary(id)">x</button>
    </div>
    <div class="flex flex-row space-x-4 h-full w-full">
      <div class="flex flex-col px-2 w-1/4">
        <img src="/tube.png" />
      </div>
      <div class="flex flex-col w-3/4 text-left text-sm">
        <dl class="flex">
          <dt class="w-1/4">Barcode</dt>
          <dd class="w-3/4" data-attribute="barcode">{{ barcode }}</dd>
        </dl>
        <div v-if="valid">
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
          <dl v-if="!run_suitability.ready_for_run" class="flex">
            <dt>Errors</dt>
            <dd>
              <ul>
                <li v-for="(error, index) in run_suitability.formattedErrors" :key="index">
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
</template>

<!-- eslint-disable vue/prop-name-casing -->
<script setup>
import { computed } from 'vue'
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
    required: true,
    default: 0,
  },
  concentration: {
    type: Number,
    required: true,
    default: 0,
  },
  template_prep_kit_box_barcode: {
    type: String,
    required: true,
    default: '',
  },
  insert_size: {
    type: Number,
    required: true,
    default: 0,
  },
  run_suitability: {
    type: Object,
    required: true,
    default: () => {
      return {
        ready_for_run: false,
        errors: [],
      }
    },
  },
})

const store = usePacbioRunCreateStore()
const valid = computed(() => props.run_suitability.ready_for_run)
const classes = computed(
  () =>
    `m-1 border-2 cursor-pointer rounded-md pb-2  ${
      valid.value ? 'hover:bg-gray-200' : 'failure-style'
    }`,
)
const img = new Image()
img.src = '/tube.png'

function drag(barcode, event) {
  event.dataTransfer.setDragImage(img, 120, 50)
  event.dataTransfer.setData('barcode', barcode)
}
</script>
