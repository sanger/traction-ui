
<template>
  <b-list-group-item 
    draggable="true" 
    v-on:dragstart="drag(name, $event)" 
    v-bind:class="[ {active: isActive}, { selected: selected }]"
    v-on:mouseover="isActive = true" 
    v-on:mouseleave="isActive = false"
  >
    <b-img left src="/tube.png" height="30" draggable="false" />
    <div class="name">
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
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    drag (name, event) {
      if (this.selected) {
        alert('This library is already selected')
        return
      }

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

  .selected {
    background-color: black;
    border: gray;
  }
</style>
