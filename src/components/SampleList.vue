<template>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>Sample ID</th>
        <th>Name</th>
        <th>Species</th>
      </tr>
    </thead>
    <tbody>
      <sample v-for="sample in samples" v-bind:key="sample.id" v-bind:sample="sample"></sample>
    </tbody>
  </table>
</template>

<script>
import Sample from '@/components/Sample'

export default {
  name: 'SampleList',

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
  },
  components: {
    Sample
  }
}
</script>

<style>
</style>
