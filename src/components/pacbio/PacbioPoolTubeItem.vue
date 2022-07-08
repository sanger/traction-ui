<template>
  <b-list-group-item
    :draggable="!!valid"
    :variant="valid ? 'default' : 'danger'"
    button
    @dragstart="drag(barcode, $event)"
    @click="expanded = !expanded"
  >
    <b-row>
      <b-col cols="3">
        <img src="/tube.png" />
        <b-button
          :id="`editPool-${id}`"
          size="sm"
          variant="outline-primary"
          class="btn-block"
          :to="{ name: 'PacbioPoolCreate', params: { id: id } }"
          >Edit</b-button
        >
      </b-col>
      <b-col cols="9">
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
      </b-col>
    </b-row>
  </b-list-group-item>
</template>

<script>
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
  },
  // TODO: need to add a a test for drag
  methods: {
    drag(barcode, event) {
      event.dataTransfer.setDragImage(img, 120, 50)
      event.dataTransfer.setData('barcode', barcode)
    },
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
