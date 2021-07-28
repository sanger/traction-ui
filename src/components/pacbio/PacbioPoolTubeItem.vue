<template>
  <b-list-group-item
    draggable="true"
    :class="{ active: isActive }"
    @dragstart="drag(barcode, $event)"
    @mouseover="isActive = true"
    @mouseleave="isActive = false"
  >
    <b-row>
      <b-col cols="3">
        <b-img src="/tube.png" />
      </b-col>
      <b-col cols="9">
        <div class="barcode"><b>Barcode:</b> {{ barcode }}</div>
        <b>Libraries:</b>
        <ul>
          <li v-for="library in libraries" :key="library.id">
            {{ library.sample_name }}
            <br />
            {{ library.group_id }}
          </li>
        </ul>
      </b-col>
    </b-row>
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
    libraries: {
      type: Array,
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
img {
  max-width: 100%;
}
div {
  text-align: left;
}
.active {
  background-color: gray;
  filter: none;
}
</style>
