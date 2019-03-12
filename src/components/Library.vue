<template>
  <div class="library">
     <input id="barcode" v-model="barcode" type="text" @change="findLibrary" />
  </div>
</template>

<script>

export default {
  name: 'Library',
  props: {
    id: {
      type: [Number, String]
    },
    tube: {
      type: Object,
      default: () => {
        return { id: '', barcode: '' }
      }
    }
  },
  data () {
    return {
      barcode: this.tube.barcode 
    }
  },
  methods: {
    findLibrary () {
      return
    }
  },
  computed: {
  }
}
</script>