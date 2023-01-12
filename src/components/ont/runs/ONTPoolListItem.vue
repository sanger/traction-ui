<template>
  <traction-list-group-item draggable="true" @dragstart="dragStart">
    <traction-row>
      <traction-col cols="9">
        <dl class="row">
          <dd data-attribute="kit_barcode">{{ pool.kit_barcode }}</dd>
        </dl>
      </traction-col>
    </traction-row>
  </traction-list-group-item>
</template>

<script>
const img = new Image()
img.src = '/tube.png'

export default {
  name: 'PacbioPoolTubeItem',
  props: {
    pool: {
      type: Object,
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  // TODO: need to add a a test for drag
  methods: {
    dragStart(event) {
      event.dataTransfer.setDragImage(img, 120, 50)
      event.dataTransfer.setData('barcode', 'aBarcode')
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
