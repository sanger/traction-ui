<!-- TODO: move inline styles to css -->
<template>
  <b-list-group-item draggable="true" v-on:dragstart="drag(barcode, $event)" v-bind:class="{active: isActive}" v-on:mouseover="isActive = true" v-on:mouseleave="isActive = false">
    <b-img left src="tube.svg" height="70"></b-img>

    <div class="info">
      <div class="barcode">
        {{ barcode}}
      </div>
       <div class="sample_names">
        {{ sample_names }}
      </div>
       <div class="tag_oligos">
        {{ tag_oligos}}
      </div>
    </div>
 </b-list-group-item>
</template>

<script>

export default {
  name: 'Tube',
  props: {
    barcode: {
      type: String,
      required: true
    },
    sample_names: {
      type: String,
      required: true
    },
    tag_oligos: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  // TODO: need to add a a test for drag
  methods: {
    drag (barcode, event) {
      const img = new Image()
      img.src = './tube.svg'
      event.dataTransfer.setDragImage(img,120,50)
      event.dataTransfer.setData('barcode', barcode)
    }
  }
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
  }
</style>
