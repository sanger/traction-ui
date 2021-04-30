<template>
  <b-list-group-item
    draggable="true"
    :class="{ active: isActive }"
    @dragstart="drag(name, $event)"
    @mouseover="isActive = true"
    @mouseleave="isActive = false"
  >
    <b-img left src="/tube.png" height="30" draggable="false" />
    <div :id="name" class="name">
      {{ name }}
    </div>
  </b-list-group-item>
</template>

<script>
const img = new Image()
img.src = '/tube.png'

export default {
  name: 'OntTube',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isActive: false,
    }
  },
  methods: {
    drag(name, event) {
      event.dataTransfer.setDragImage(img, 80, 0)
      event.dataTransfer.setData('libraryName', name)
      event.dataTransfer.setData('sourceType', 'LIBRARY_LIST')
    },
  },
}
</script>

<style scoped lang="scss">
.active {
  background-color: gray;
  border: gray;
}
</style>
