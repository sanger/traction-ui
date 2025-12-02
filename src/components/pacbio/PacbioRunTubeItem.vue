<template>
  <div
    :class="classObject"
    :draggable="!!valid"
    data-attribute="selected-pool-library-list"
    @dragstart="drag(barcode, $event)"
    @click="expanded = !expanded"
  >
    <div class="flex flex-row">
      <div class="flex flex-col h-full w-full">
        <div class="flex flex-row w-full p-2 items-center border-b-2">
          <p class="text-xl font-bold w-full px-2 text-left" data-attribute="barcode">
            {{ barcode }}
          </p>
          <div class="p-1">
            <traction-badge data-attribute="type" :colour="typeColour(type)">{{
              type
            }}</traction-badge>
          </div>
          <button
            class="text-xl h-8 w-8 m-0 leading-none"
            data-attribute="remove-tube"
            @click="removeTube"
          >
            x
          </button>
        </div>
        <div class="flex flex-row text-left text-sm w-full">
          <div class="flex flex-col w-1/4 justify-center">
            <img src="/tube.png" />
            <traction-button
              v-if="type == 'pools'"
              :id="`editPool-${id}`"
              size="sm"
              theme="edit"
              :to="{ name: 'PacbioPoolCreate', params: { id: id } }"
              >Edit</traction-button
            >
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
            <dl class="flex space-x-4 p-1 px-4" data-attribute="samples">
              <dt class="w-1/4 text-gray-500 font-bold">Samples</dt>
              <dd class="w-3/4">
                <ul>
                  <li v-for="sample in samples" :key="sample">
                    {{ sample }}
                  </li>
                </ul>
              </dd>
            </dl>
            <dl v-if="!run_suitability.ready_for_run" class="flex space-x-4 p-1 px-4 bg-gray-200">
              <dt class="w-1/4 text-gray-500 font-bold">Errors</dt>
              <dd class="w-3/4">
                <ul>
                  <li v-for="(error, index) in errors" :key="index">
                    {{ error }}
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
          <div
            v-else
            class="flex w-full items-center justify-center text-xl font-bold border-l space-x-2"
          >
            <TractionDangerIcon />
            <p>
              {{ type == 'libraries' ? 'Library' : 'Pool' }} invalid. Click for more information
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable vue/prop-name-casing -->
<script setup>
import { ref, computed } from 'vue'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import TractionDangerIcon from '@/components/shared/icons/TractionDangerIcon.vue'
import TractionBadge from '@/components/shared/TractionBadge.vue'
import useAlert from '@/composables/useAlert'
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  barcode: {
    type: String,
    default: '',
  },
  samples: {
    type: Array,
    required: false,
    default: () => [],
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
})

const { showAlert } = useAlert()
const store = usePacbioRunCreateStore()
const img = new Image()
img.src = '/tube.png'
const expanded = ref(false)
const valid = computed(() => props.run_suitability.ready_for_run)
const errors = computed(
  () =>
    props.run_suitability.formattedErrors ||
    props.run_suitability.errors.map((error) => error.detail),
)
const classObject = computed(
  () =>
    `shadow-md border cursor-pointer rounded-md transition-all duration-200 ${
      valid.value ? 'hover:border-green-400' : 'hover:border-red-400'
    }`,
)
const drag = (barcode, event) => {
  event.dataTransfer.setDragImage(img, 120, 50)
  event.dataTransfer.setData('barcode', barcode)
}
const removeTube = () => {
  if (props.type == 'pools') {
    const { success, errors } = store.removePool(props.id)
    if (!success) {
      showAlert(errors.join(', '), 'warning')
    }
  } else {
    const { success, errors } = store.removeLibrary(props.id)
    if (!success) {
      showAlert(errors.join(', '), 'warning')
    }
  }
}
const typeColour = (type) => {
  return type == 'pools' ? 'sdb' : 'sanger-pink'
}
</script>
