<template>
  <b-table class="sample-table" striped hover :items="samples"></b-table>
</template>

<script>

export default {
  name: 'SampleTable',

  data () {
    return {
    }
  },
  props: {
    samples: {
      type: Array,
      default: function () {
        return []
      }
    }
  }
}
</script>
