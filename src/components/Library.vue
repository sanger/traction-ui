<template>
  <div class="library">
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
  },
  computed: {
  }
}
</script>