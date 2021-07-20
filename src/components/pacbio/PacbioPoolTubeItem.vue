<template>
  <b-list-group-item
    draggable="true"
    :class="{ active: isActive }"
    @dragstart="drag(barcode, $event)"
    @mouseover="isActive = true"
    @mouseleave="isActive = false"
  >
    <b-img left src="/tube.png" height="70" />
    <div class="info">
      <div class="barcode">
        {{ barcode }}
      </div>
      <div class="sample_name">
        {{ sample_name }}
      </div>
      <div class="tag_group_id">
        {{ tag_group_id }}
      </div>
    </div>
  </b-list-group-item>
</template>

<script>
const img = new Image()
img.src = '/tube.png'

export default {
  name: 'Tube',
  props: {
    barcode: {
      type: String,
      required: true,
    },
    // eslint-disable-next-line vue/prop-name-casing
    sample_name: {
      type: String,
      required: true,
    },
    // eslint-disable-next-line vue/prop-name-casing
    tag_group_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isActive: false,
    }
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
svg {
  float: left;
  width: 82px;
  height: 64px;
}
image {
  width: 82px;
  height: 64px;
}
div {
  text-align: left;
}
.active {
  background-color: gray;
  filter: none;
}
</style>
