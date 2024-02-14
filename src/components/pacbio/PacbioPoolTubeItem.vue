<template>
  <div
    :class="classObject"
    :draggable="!!valid"
    data-attribute="selected-pool-list"
    @dragstart="drag(barcode, $event)"
    @click="expanded = !expanded"
  >
    <div class="flex justify-end">
      <button class="w-8 bg-gray-300 text-slate-400" @click="removePool(id)">x</button>
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

<script>
import { mapActions } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'

const img = new Image()
img.src = '/tube.png'

export default {
  name: 'PacbioPoolTubeItem',
  props: {
    id: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      required: true,
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
    /* eslint-disable vue/prop-name-casing */
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
    /* eslint-enable vue/prop-name-casing */
    closeable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    valid() {
      return this.run_suitability.ready_for_run
    },
    showInfo() {
      return this.valid || this.expanded
    },
    errors() {
      return this.run_suitability.formattedErrors
    },
    classObject() {
      // when the pool is valid we have a gray background
      // when the pool is invalid we have a red background with red text
      return `m-1 border-2 cursor-pointer rounded-md pb-2  ${
        this.valid ? 'hover:bg-gray-200' : 'failure-style'
      }`
    },
  },
  methods: {
    drag(barcode, event) {
      event.dataTransfer.setDragImage(img, 120, 50)
      event.dataTransfer.setData('barcode', barcode)
    },
    ...mapActions(usePacbioRunCreateStore, ['removePool']),
  },
}
</script>
