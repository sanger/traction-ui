
<template>
  <b-list-group-item 
    draggable="true" 
    v-on:dragstart="drag(name, $event)" 
    v-bind:class="{active: isActive}" 
    v-on:mouseover="isActive = true" 
    v-on:mouseleave="isActive = false"
  >
    <b-img left src="/tube.png" height="30" />
    <div class="name">
      {{ name }}
    </div>
 </b-list-group-item>
</template>

<script>

export default {
  name: 'Tube',
  props: {
    name: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    drag (name, event) {
      const img = new Image()
      img.src = '/tube.png'
      event.dataTransfer.setDragImage(img, 80, 0)
      event.dataTransfer.setData('name', name)
    }
  },
}
</script>

<style scoped lang="scss">
  .active {
    background-color: gray;
    border: gray;
  }
</style>
