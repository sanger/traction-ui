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
    <div class="flex flex-row space-x-4 h-full">
      <div class="flex flex-col px-2">
        <img src="/tube.png" />
        <traction-button
          :id="`editPool-${id}`"
          size="sm"
          theme="edit"
          :to="{ name: 'PacbioPoolCreate', params: { id: id } }"
          >Edit</traction-button
        >
      </div>
      <div class="flex flex-col">
        <dl class="row">
          <dt>Barcode</dt>
          <dd data-attribute="barcode">{{ barcode }}</dd>
        </dl>
        <div v-if="showInfo">
          <dl class="row">
            <dt>Source</dt>
            <dd data-attribute="source-identifier">{{ source_identifier }}</dd>
            <dt>Volume</dt>
            <dd data-attribute="volume">{{ volume || 'Unknown' }}</dd>
            <dt>Concentration</dt>
            <dd data-attribute="concentration">{{ concentration || 'Unknown' }}</dd>
            <dt>Template prep kit box barcode</dt>
            <dd data-attribute="template-prep-kit-box-barcode">
              {{ template_prep_kit_box_barcode || 'Unknown' }}
            </dd>
            <dt>Insert size</dt>
            <dd data-attribute="insert-size">{{ insert_size || 'Unknown' }}</dd>
            <dt>Libraries</dt>
            <dd>
              <ul>
                <li v-for="library in libraries" :key="library.id">
                  {{ library.sample_name }} : {{ library.group_id }}
                </li>
              </ul>
            </dd>
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
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('traction/pacbio/runCreate')

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
      // TODO: modify red background for hover to be slightly softer. Need new tailwind colour
      return `m-1 border-2 cursor-pointer rounded-md pb-2  ${
        this.valid ? 'hover:bg-gray-200' : 'bg-red-200 hover:bg-red-300 text-red-800'
      }`
    },
  },
  methods: {
    drag(barcode, event) {
      event.dataTransfer.setDragImage(img, 120, 50)
      event.dataTransfer.setData('barcode', barcode)
    },
    ...mapMutations(['removePool']),
  },
}
</script>

<style scoped lang="scss">
img {
  max-width: 100%;
}
div {
  text-align: left;
}

dt {
  width: 30%;
}
dd {
  width: 70%;
}

.active {
  background-color: gray;
  filter: none;
}
</style>
